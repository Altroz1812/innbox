-- Create product_views table for tracking product page views
CREATE TABLE public.product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on product_views
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_views
CREATE POLICY "Anyone can insert product views"
ON public.product_views
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view product views"
ON public.product_views
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_viewed_at ON public.product_views(viewed_at DESC);

-- Create site_settings table for site configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
('company_info', '{
  "name": "MaxPrefabs",
  "email": "info@maxprefabs.com",
  "phone": "+971 XX XXX XXXX",
  "whatsapp": "+971 XX XXX XXXX",
  "address": "Dubai, UAE"
}'::jsonb),
('email_notifications', '{
  "inquiry_enabled": true,
  "quote_enabled": true,
  "recipient_email": "admin@maxprefabs.com"
}'::jsonb);