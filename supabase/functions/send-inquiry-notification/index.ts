import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json() as { record: InquiryRecord };
    
    console.log("Processing inquiry notification for:", record.id);

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1e40af; }
            .divider { border-top: 2px solid #e5e7eb; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Inquiry Received</h1>
            </div>
            <div class="content">
              <p>You have received a new inquiry through the Innbox Prefab website.</p>
              
              <div class="divider"></div>
              
              <div class="field">
                <span class="label">Name:</span> ${record.name}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${record.email}
              </div>
              ${record.phone ? `<div class="field"><span class="label">Phone:</span> ${record.phone}</div>` : ''}
              <div class="field">
                <span class="label">Inquiry Type:</span> ${record.inquiry_type}
              </div>
              <div class="field">
                <span class="label">Submitted:</span> ${new Date(record.created_at).toLocaleString()}
              </div>
              
              <div class="divider"></div>
              
              <div class="field">
                <span class="label">Message:</span>
                <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${record.message}</p>
              </div>
              
              <div class="divider"></div>
              
              <p style="color: #6b7280; font-size: 14px;">This is an automated notification from Innbox Prefab CMS.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .cta { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Dear ${record.name},</p>
              
              <p>Thank you for reaching out to <strong>Innbox Prefab</strong>. We have received your inquiry and our team will review it shortly.</p>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your inquiry within 24 hours</li>
                <li>A dedicated specialist will contact you via email or phone</li>
                <li>We'll provide you with detailed information and next steps</li>
              </ul>
              
              <p>In the meantime, feel free to explore our range of prefabricated solutions designed for modern construction needs.</p>
              
              <a href="https://innboxmodular.com/products" class="cta">View Our Products</a>
              
              <p style="margin-top: 30px;">If you have any urgent questions, please don't hesitate to contact us directly:</p>
              <p>
                📧 Email: info@innboxmodular.com<br>
                📞 Phone: [Your Phone Number]
              </p>
              
              <div class="footer">
                <p><strong>Innbox Prefab</strong></p>
                <p>Building Tomorrow's Solutions Today</p>
                <p style="font-size: 12px; margin-top: 10px;">© ${new Date().getFullYear()} Innbox Modular. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send admin notification
    const adminEmail = await resend.emails.send({
      from: "Innbox Prefab <info@innboxmodular.com>",
      to: ["info@innboxmodular.com"],
      subject: `New Inquiry from ${record.name}`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmail);

    // Send customer confirmation
    const customerEmail = await resend.emails.send({
      from: "Innbox Prefab <info@innboxmodular.com>",
      to: [record.email],
      subject: "Thank you for contacting Innbox Prefab",
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmail.data?.id, 
        customerEmail: customerEmail.data?.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-inquiry-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
