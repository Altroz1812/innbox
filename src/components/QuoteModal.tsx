import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { quoteSchema, validateFile, sanitizeString } from "@/lib/formValidation";
import { useFormDebounce } from "@/hooks/useFormDebounce";
import { compressImage } from "@/lib/imageOptimization";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
}

const QuoteModal = ({ open, onOpenChange, productId, productName }: QuoteModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeline, setTimeline] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { canSubmit } = useFormDebounce();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      company: formData.get('company') as string || '',
      contact_name: formData.get('contact_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || '',
      product_interest: productName || (formData.get('product_interest') as string),
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
        product_id: productId || null,
        attachments: attachmentUrls,
      };

      const { error } = await supabase.from('quote_requests').insert([sanitizedData]);

      if (error) {
        toast.error('Failed to submit quote request. Please try again.');
      } else {
        toast.success('Quote request submitted! We will contact you soon.');
        onOpenChange(false);
        (e.target as HTMLFormElement).reset();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          {productName && (
            <p className="text-sm text-muted-foreground">
              For: <span className="font-medium text-foreground">{productName}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder="+91 xxx-xxx-xxxx" 
              maxLength={20}
              autoComplete="tel"
            />
          </div>

          {!productName && (
            <div>
              <Label htmlFor="product_interest">Product Interest *</Label>
              <Input 
                id="product_interest" 
                name="product_interest" 
                placeholder="Which product are you interested in?" 
                required 
              />
            </div>
          )}

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

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;
