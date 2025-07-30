import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  strategyData: {
    summary: string;
    actionPlan: string;
    stakeholderFocus: string;
    trainingLevel: string;
    communicationFrequency: string;
    frameworks: string;
  };
  assessmentData: {
    organizationSize: string;
    industry: string;
    stakeholderGroups: string[];
    numberOfStakeholders: string;
    changeTypes: string[];
    urgency: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, strategyData, assessmentData }: EmailRequest = await req.json();

    console.log("Sending strategy email to:", email);

    // Create PDF content as HTML for email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Change Management Strategy Summary</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .tagline { color: #666; font-style: italic; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 20px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 15px; }
          .assessment-summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .assessment-item { margin-bottom: 10px; }
          .assessment-label { font-weight: bold; color: #374151; }
          .cta-section { background: #eff6ff; padding: 25px; border-radius: 8px; margin-top: 40px; text-align: center; }
          .cta-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 15px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Change Metis</div>
          <div class="tagline">Smart shifts • Lean budgets</div>
        </div>

        <div class="assessment-summary">
          <h2 style="margin-top: 0; color: #1e40af;">Assessment Overview</h2>
          <div class="assessment-item">
            <span class="assessment-label">Organization:</span> ${assessmentData.organizationSize} ${assessmentData.industry} company
          </div>
          <div class="assessment-item">
            <span class="assessment-label">Change Types:</span> ${assessmentData.changeTypes.join(', ')}
          </div>
          <div class="assessment-item">
            <span class="assessment-label">Stakeholder Groups:</span> ${assessmentData.stakeholderGroups.join(', ')}
          </div>
          <div class="assessment-item">
            <span class="assessment-label">Impacted Stakeholders:</span> ${assessmentData.numberOfStakeholders}
          </div>
          <div class="assessment-item">
            <span class="assessment-label">Urgency Level:</span> ${assessmentData.urgency}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Strategy Summary</div>
          <p>${strategyData.summary}</p>
        </div>

        <div class="section">
          <div class="section-title">Action Plan</div>
          <div style="white-space: pre-line;">${strategyData.actionPlan}</div>
        </div>

        <div class="section">
          <div class="section-title">Stakeholder Focus</div>
          <p>${strategyData.stakeholderFocus}</p>
        </div>

        <div class="section">
          <div class="section-title">Training Recommendations</div>
          <p>${strategyData.trainingLevel}</p>
        </div>

        <div class="section">
          <div class="section-title">Communication Strategy</div>
          <p>${strategyData.communicationFrequency}</p>
        </div>

        <div class="section">
          <div class="section-title">Recommended Frameworks</div>
          <p>${strategyData.frameworks}</p>
        </div>

        <div class="cta-section">
          <div class="cta-title">Ready for a Truly Bespoke Strategy?</div>
          <p style="margin-bottom: 20px;">For comprehensive, tailored change-management resources that adapt perfectly to your organization:</p>
          <p><strong>Basic Toolkit:</strong> Instant, editable templates to adapt as needed</p>
          <p><strong>Premium Toolkit:</strong> Fully customized resources tailored to your organization</p>
          <p style="margin-top: 20px;">
            <a href="https://changemetis.com/pricing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Our Toolkits</a>
          </p>
        </div>

        <div class="footer">
          <p><strong>Change Metis</strong><br>
          Smart shifts • Lean budgets<br>
          <a href="mailto:support@changemetis.com">support@changemetis.com</a> | <a href="https://changemetis.com">changemetis.com</a></p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Change Metis <strategy@changemetis.com>",
      to: [email],
      subject: "Your Change Management Strategy Summary Is Here!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1>Hi there!</h1>
          
          <p>Thank you for using Change Metis!</p>
          
          <p>Your personalized change-management summary is ready. You can review it directly on our site or download the PDF attached.</p>
          
          <p style="margin: 30px 0;">
            <a href="https://changemetis.com/results" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Results Online</a>
          </p>
          
          <p>We hope this summary gives you clear, actionable insights for your upcoming change initiative. For a truly bespoke strategy—complete with templates, detailed plans, and expert guidance—consider our paid toolkits:</p>
          
          <ul>
            <li><strong>Basic Toolkit:</strong> Instant, editable templates to adapt as needed</li>
            <li><strong>Premium Toolkit:</strong> Fully customized resources tailored to your organization</li>
          </ul>
          
          <p>Feel free to explore these options at any time, and thank you again for choosing Change Metis for your change-management journey!</p>
          
          <p>Best regards,<br>
          The Change Metis Team<br>
          <em>Smart shifts • Lean budgets</em><br>
          <a href="mailto:support@changemetis.com">support@changemetis.com</a> | <a href="https://changemetis.com">changemetis.com</a></p>
        </div>
      `,
      attachments: [
        {
          filename: 'change-management-strategy.html',
          content: Buffer.from(htmlContent).toString('base64'),
        }
      ]
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending strategy email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);