import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRecord {
  id: string;
  company: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  product_interest: string | null;
  timeline: string | null;
  budget_range: string | null;
  details: string | null;
  attachments: any[];
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json() as { record: QuoteRecord };
    
    console.log("Processing quote notification for:", record.id);

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
            .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Quote Request</h1>
            </div>
            <div class="content">
              <p>You have received a new quote request through the Innbox Prefab website.</p>
              
              <div class="highlight">
                <strong>Reference ID:</strong> ${record.id.substring(0, 8).toUpperCase()}
              </div>
              
              <div class="divider"></div>
              
              ${record.company ? `<div class="field"><span class="label">Company:</span> ${record.company}</div>` : ''}
              <div class="field">
                <span class="label">Contact Name:</span> ${record.contact_name}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${record.email}
              </div>
              ${record.phone ? `<div class="field"><span class="label">Phone:</span> ${record.phone}</div>` : ''}
              ${record.product_interest ? `<div class="field"><span class="label">Product Interest:</span> ${record.product_interest}</div>` : ''}
              ${record.timeline ? `<div class="field"><span class="label">Timeline:</span> ${record.timeline}</div>` : ''}
              ${record.budget_range ? `<div class="field"><span class="label">Budget Range:</span> ${record.budget_range}</div>` : ''}
              <div class="field">
                <span class="label">Submitted:</span> ${new Date(record.created_at).toLocaleString()}
              </div>
              
              <div class="divider"></div>
              
              ${record.details ? `
              <div class="field">
                <span class="label">Project Details:</span>
                <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${record.details}</p>
              </div>
              ` : ''}
              
              ${record.attachments && record.attachments.length > 0 ? `
              <div class="field">
                <span class="label">Attachments:</span>
                <ul>
                  ${record.attachments.map((att: any) => `<li>${att.name || 'Attachment'}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
              
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
            .reference { background: #eff6ff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .cta { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .features { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Quote Request Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${record.contact_name},</p>
              
              <p>Thank you for your interest in <strong>Innbox Prefab</strong> solutions! We have received your quote request and are excited to work with you.</p>
              
              <div class="reference">
                <p style="margin: 0; color: #1e40af; font-weight: bold;">Your Reference Number</p>
                <h2 style="margin: 10px 0; color: #1e40af;">${record.id.substring(0, 8).toUpperCase()}</h2>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Please keep this for your records</p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ol>
                <li><strong>Review (24-48 hours):</strong> Our technical team will review your requirements</li>
                <li><strong>Custom Quote:</strong> We'll prepare a detailed quotation tailored to your needs</li>
                <li><strong>Consultation:</strong> A specialist will contact you to discuss the proposal</li>
                <li><strong>Refinement:</strong> We'll adjust the quote based on your feedback</li>
              </ol>
              
              <div class="features">
                <p><strong>Why Choose Innbox Prefab?</strong></p>
                <ul style="margin: 10px 0;">
                  <li>🏗️ High-quality, durable prefabricated structures</li>
                  <li>⚡ Fast installation and delivery</li>
                  <li>💰 Cost-effective solutions</li>
                  <li>🎨 Customizable designs</li>
                  <li>✅ Comprehensive support and warranty</li>
                </ul>
              </div>
              
              <center>
                <a href="https://innboxmodular.com/projects" class="cta">View Our Projects</a>
              </center>
              
              <p style="margin-top: 30px;">If you have any questions in the meantime, feel free to reach out:</p>
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
      subject: `New Quote Request from ${record.contact_name}${record.company ? ` (${record.company})` : ''}`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmail);

    // Send customer confirmation
    const customerEmail = await resend.emails.send({
      from: "Innbox Prefab <info@innboxmodular.com>",
      to: [record.email],
      subject: "Your Quote Request - Innbox Prefab",
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
    console.error("Error in send-quote-notification:", error);
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
