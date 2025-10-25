-- Fix security warnings: Set search_path for webhook functions

-- Drop and recreate webhook for inquiry notifications with proper search_path
DROP FUNCTION IF EXISTS trigger_inquiry_email_webhook() CASCADE;
CREATE OR REPLACE FUNCTION trigger_inquiry_email_webhook()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  project_url text := 'https://rrpyebmtrgxhqsrzbrls.supabase.co';
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop and recreate webhook for quote request notifications with proper search_path
DROP FUNCTION IF EXISTS trigger_quote_email_webhook() CASCADE;
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate triggers
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_inquiry_email_webhook();

CREATE TRIGGER on_quote_created
  AFTER INSERT ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION trigger_quote_email_webhook();