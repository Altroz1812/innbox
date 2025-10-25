-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create webhook for inquiry notifications
CREATE OR REPLACE FUNCTION trigger_inquiry_email_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  project_url text := 'https://rrpyebmtrgxhqsrzbrls.supabase.co';
  service_role_key text := current_setting('request.jwt.claim.sub', true);
BEGIN
  SELECT net.http_post(
    url := project_url || '/functions/v1/send-inquiry-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  ) INTO request_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create webhook for quote request notifications
CREATE OR REPLACE FUNCTION trigger_quote_email_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  project_url text := 'https://rrpyebmtrgxhqsrzbrls.supabase.co';
BEGIN
  SELECT net.http_post(
    url := project_url || '/functions/v1/send-quote-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  ) INTO request_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for inquiries table
DROP TRIGGER IF EXISTS on_inquiry_created ON public.inquiries;
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_inquiry_email_webhook();

-- Create trigger for quote_requests table
DROP TRIGGER IF EXISTS on_quote_created ON public.quote_requests;
CREATE TRIGGER on_quote_created
  AFTER INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION trigger_quote_email_webhook();