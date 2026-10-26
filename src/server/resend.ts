import { LeadItem } from '../types/index.js';

interface EmailResult {
  success: boolean;
  messageId?: string;
  mode: 'resend' | 'local_fallback';
  error?: string;
}

export async function sendLeadNotification(lead: LeadItem): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.NOTIFICATION_RECIPIENT_EMAIL?.trim() || 'tharusudeep242@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #070b19; color: #f1f5f9; padding: 24px; }
          .card { background: #0c142b; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 20px; }
          .brand { color: #00f0ff; font-weight: 800; font-size: 20px; letter-spacing: 1px; }
          .badge { display: inline-block; background: rgba(0, 240, 255, 0.15); color: #38bdf8; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .field { margin-bottom: 14px; }
          .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .value { font-size: 15px; color: #f8fafc; font-weight: 500; }
          .message-box { background: rgba(5, 7, 15, 0.7); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 14px; margin-top: 8px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; }
          .footer { margin-top: 24px; pt-4; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="brand">ZENTRA TECH</div>
            <p style="margin: 6px 0 0; color: #94a3b8; font-size: 14px;">New Client Enquiry Received</p>
          </div>
          
          <div class="field">
            <span class="badge">Status: ${lead.status}</span>
          </div>

          <div class="field">
            <div class="label">Client Name</div>
            <div class="value">${lead.name}</div>
          </div>

          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${lead.email}" style="color: #00f0ff; text-decoration: none;">${lead.email}</a></div>
          </div>

          <div class="field">
            <div class="label">Requested Service</div>
            <div class="value">${lead.service}</div>
          </div>

          ${lead.budget ? `
          <div class="field">
            <div class="label">Estimated Budget</div>
            <div class="value">${lead.budget}</div>
          </div>
          ` : ''}

          ${lead.timeline ? `
          <div class="field">
            <div class="label">Estimated Timeline</div>
            <div class="value">${lead.timeline}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">Project Details / Message</div>
            <div class="message-box">${lead.message}</div>
          </div>

          <div class="footer">
            Received on ${lead.date} via Zentra Tech Website Enquiry Portal.
          </div>
        </div>
      </body>
    </html>
  `;

  // Real Resend delivery if API key is provided
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Zentra Agency <${fromEmail}>`,
          to: [recipient],
          subject: `⚡ New Enquiry: ${lead.name} (${lead.service})`,
          html: htmlContent,
          reply_to: lead.email,
        }),
      });

      const data = await response.json() as { id?: string; error?: { message?: string } };

      if (!response.ok) {
        console.error('[Resend] API Error:', data);
        return {
          success: false,
          mode: 'resend',
          error: data.error?.message || 'Failed to send email via Resend',
        };
      }

      console.log(`[Resend] Successfully dispatched notification to ${recipient} (Message ID: ${data.id})`);
      return {
        success: true,
        messageId: data.id,
        mode: 'resend',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[Resend] Network exception:', errorMsg);
      return {
        success: false,
        mode: 'resend',
        error: errorMsg,
      };
    }
  }

  // Graceful Local Fallback mode when API key is not configured
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 [RESEND LOCAL DISPATCH LOG - New Client Lead]');
  console.log(`   To: ${recipient}`);
  console.log(`   From: ${lead.name} <${lead.email}>`);
  console.log(`   Service: ${lead.service}`);
  console.log(`   Budget: ${lead.budget || 'Not specified'}`);
  console.log(`   Date: ${lead.date}`);
  console.log(`   Message:\n   "${lead.message}"`);
  console.log('   (Tip: Add RESEND_API_KEY to .env to deliver live emails to inbox)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return {
    success: true,
    mode: 'local_fallback',
  };
}
