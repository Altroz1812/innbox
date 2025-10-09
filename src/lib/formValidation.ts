import { z } from "zod";

// Sanitization helper
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Max length safety
};

// File validation constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.dwg'];

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File ${file.name} exceeds 5MB limit` };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: `File type ${extension} not allowed` };
  }

  // Check MIME type for images and PDFs
  if (extension !== '.dwg' && !ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type for ${file.name}` };
  }

  return { valid: true };
};

// Inquiry form schema
export const inquirySchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  inquiry_type: z.string()
    .min(1, "Please select an inquiry type"),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Quote request schema
export const quoteSchema = z.object({
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  contact_name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+\d\s()-]*$/, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  product_interest: z.string()
    .min(1, "Please select a product"),
  timeline: z.string().optional(),
  budget_range: z.string().optional(),
  details: z.string()
    .trim()
    .min(10, "Details must be at least 10 characters")
    .max(2000, "Details must be less than 2000 characters"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
export type QuoteFormData = z.infer<typeof quoteSchema>;
