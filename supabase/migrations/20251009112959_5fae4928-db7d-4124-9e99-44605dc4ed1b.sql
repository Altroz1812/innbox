-- Create storage bucket for quote attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Add attachments column to quote_requests table
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Add product_id column to link quotes to products (optional)
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES products(id) ON DELETE SET NULL;

-- Storage policies for quote-attachments bucket
CREATE POLICY "Authenticated users can upload quote attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quote-attachments');

CREATE POLICY "Admins can view all quote attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'quote-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quote attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'quote-attachments' AND has_role(auth.uid(), 'admin'::app_role));