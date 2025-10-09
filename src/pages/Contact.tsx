import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { inquirySchema, quoteSchema, validateFile, sanitizeString } from "@/lib/formValidation";
import { useFormDebounce } from "@/hooks/useFormDebounce";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/structuredData";
import { compressImage } from "@/lib/imageOptimization";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryType, setInquiryType] = useState("");
  const [productInterest, setProductInterest] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { canSubmit } = useFormDebounce();

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      inquiry_type: inquiryType,
      message: formData.get('message') as string,
    };

    // Validate with Zod
    const validation = inquirySchema.safeParse(rawData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    // Rate limiting check
    const submitCheck = canSubmit(rawData.email);
    if (!submitCheck.allowed) {
      toast.error(submitCheck.message);
      return;
    }

    setIsSubmitting(true);

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(validation.data.name),
      email: validation.data.email.toLowerCase(),
      phone: sanitizeString(validation.data.phone),
      inquiry_type: validation.data.inquiry_type,
      message: sanitizeString(validation.data.message),
    };

    const { error } = await supabase.from('inquiries').insert([sanitizedData]);

    if (error) {
      toast.error('Failed to send message. Please try again.');
    } else {
      toast.success('Thank you! We will get back to you soon.');
      (e.target as HTMLFormElement).reset();
      setInquiryType("");
    }

    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate each file
      for (const file of newFiles) {
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          return;
        }
      }
      
      // Check total files
      if (selectedFiles.length + newFiles.length > 5) {
        toast.error('Maximum 5 files allowed');
        return;
      }
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];
    
    for (const file of selectedFiles) {
      // Compress image before upload
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
        } catch (error) {
          console.error('Compression failed, using original file:', error);
        }
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('quote-attachments')
        .upload(fileName, fileToUpload);

      if (error) {
        console.error('File upload error:', error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('quote-attachments')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      company: formData.get('company') as string || '',
      contact_name: formData.get('contact_name') as string,
      email: formData.get('quote_email') as string,
      phone: formData.get('quote_phone') as string || '',
      product_interest: productInterest,
      timeline: timeline,
      budget_range: budgetRange,
      details: formData.get('details') as string,
    };

    // Validate with Zod
    const validation = quoteSchema.safeParse(rawData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    // Rate limiting check
    const submitCheck = canSubmit(rawData.email);
    if (!submitCheck.allowed) {
      toast.error(submitCheck.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const attachmentUrls = await uploadFiles();

      // Sanitize inputs
      const sanitizedData = {
        company: validation.data.company ? sanitizeString(validation.data.company) : null,
        contact_name: sanitizeString(validation.data.contact_name),
        email: validation.data.email.toLowerCase(),
        phone: validation.data.phone ? sanitizeString(validation.data.phone) : null,
        product_interest: validation.data.product_interest,
        timeline: validation.data.timeline,
        budget_range: validation.data.budget_range,
        details: sanitizeString(validation.data.details),
        attachments: attachmentUrls,
      };

      const { error } = await supabase.from('quote_requests').insert([sanitizedData]);

      if (error) {
        toast.error('Failed to submit quote request. Please try again.');
      } else {
        toast.success('Quote request submitted! We will contact you soon.');
        (e.target as HTMLFormElement).reset();
        setProductInterest("");
        setTimeline("");
        setBudgetRange("");
        setSelectedFiles([]);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Contact Us - Innbox Modular Prefab"
        description="Get in touch with Innbox Modular Prefab for inquiries and quotes. Contact us via phone +91 630-216-5600, email, or visit our office in Hyderabad, India."
        keywords="contact innbox, prefab quote, modular building inquiry, India manufacturer contact, Hyderabad"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            localBusinessSchema,
            breadcrumbSchema([
              { name: "Home", url: "https://innboxprefab.com/" },
              { name: "Contact", url: "https://innboxprefab.com/contact" }
            ])
          ]
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-hero flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/src/assets/project-2.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get in touch with our team for inquiries and quotes
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card>
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm mb-2">For general inquiries</p>
                <a href="mailto:info@innboxmodular.com" className="text-primary hover:underline">
                  info@innboxmodular.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm mb-2">Mon-Sat 8AM-6PM</p>
                <a href="tel:+916302165600" className="text-primary hover:underline">
                  +91 630-216-5600
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm">
                  Survey No-416, Dundigal Orr Service Road<br />
                  Hyderabad-500043, Telangana<br />
                  India
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="John Doe" 
                        required 
                        maxLength={100}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        maxLength={255}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        placeholder="+91 xxx-xxx-xxxx" 
                        required 
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inquiry">Inquiry Type *</Label>
                      <Select value={inquiryType} onValueChange={setInquiryType} required>
                        <SelectTrigger id="inquiry">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="quote">Product Quote</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="consultation">Project Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Tell us about your project requirements..."
                      className="min-h-[150px]"
                      required
                      maxLength={1000}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quote Request Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Request a Quote</h2>
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      placeholder="Company Ltd." 
                      maxLength={100}
                      autoComplete="organization"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_name">Contact Name *</Label>
                      <Input 
                        id="contact_name" 
                        name="contact_name" 
                        placeholder="John Doe" 
                        required 
                        maxLength={100}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quote_email">Email *</Label>
                      <Input 
                        id="quote_email" 
                        name="quote_email" 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        maxLength={255}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quote_phone">Phone Number</Label>
                    <Input 
                      id="quote_phone" 
                      name="quote_phone" 
                      type="tel" 
                      placeholder="+91 xxx-xxx-xxxx" 
                      maxLength={20}
                      autoComplete="tel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="product">Product Interest *</Label>
                    <Select value={productInterest} onValueChange={setProductInterest} required>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site-office">Site Offices</SelectItem>
                        <SelectItem value="containers">Container Houses</SelectItem>
                        <SelectItem value="cabins">Portable Cabins</SelectItem>
                        <SelectItem value="accommodation">Labour Accommodation</SelectItem>
                        <SelectItem value="security">Security Cabins</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger id="timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
                        <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                        <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                        <SelectItem value="long">Long-term (6+ months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={budgetRange} onValueChange={setBudgetRange}>
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Under $10,000</SelectItem>
                        <SelectItem value="medium">$10,000 - $50,000</SelectItem>
                        <SelectItem value="large">$50,000 - $100,000</SelectItem>
                        <SelectItem value="xlarge">Over $100,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="details">Project Details *</Label>
                    <Textarea 
                      id="details"
                      name="details"
                      placeholder="Provide details about your requirements..."
                      className="min-h-[120px]"
                      required
                      maxLength={2000}
                    />
                  </div>

                  <div>
                    <Label htmlFor="attachments">Attachments (Plans, Drawings, etc.)</Label>
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center">
                          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload files
                          </span>
                        </div>
                        <input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.dwg"
                        />
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm truncate flex-1">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full" variant="secondary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Quote'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-bold mb-2">Business Hours</h3>
                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                  <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                  <div>Saturday: 9:00 AM - 2:00 PM</div>
                  <div>Sunday: Closed</div>
                  <div>Emergency Support: 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
