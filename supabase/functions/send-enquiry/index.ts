// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "Abidaltsale@gmail.com";
const FROM_ADDRESS = "Royal Abidal Guesthouse <enquiries@royalabidal.com>";
const LOGO_URL = "https://royalabidal.com/royaladidal_logo.jpeg";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend error (${res.status}): ${errText}`);
  }

  return res.json();
}

export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    try {
      const { name, phone, email, location, message } = await req.json();

      if (!name || !phone) {
        return new Response(
          JSON.stringify({ error: "Name and phone are required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 1. Notify the guesthouse owner of the new enquiry
      await sendEmail(
        ADMIN_EMAIL,
        `New enquiry from ${name}`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <div style="background: #241d16; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h2 style="color: #fffdf8; margin: 0 0 14px; font-size: 20px;">New Booking Enquiry</h2>
              <img src="${LOGO_URL}" alt="Royal Abidal Guesthouse" style="max-width: 120px; height: auto;">
            </div>
            <div style="background: #f7f1e3; padding: 24px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px;"><strong>Phone:</strong> <a href="tel:${phone}" style="color:#8c631c;">${phone}</a></p>
              <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email || "Not provided"}</p>
              <p style="margin: 0 0 10px;"><strong>Preferred Location:</strong> ${location || "No preference"}</p>
              <p style="margin: 0 0 20px;"><strong>Message:</strong> ${message || "No additional details provided."}</p>
              <a href="https://wa.me/27${phone.replace(/^0/, "").replace(/\D/g, "")}"
                 style="display:inline-block; background:#b6842e; color:#fffdf8; text-decoration:none; padding:10px 18px; border-radius:24px; font-weight:bold; font-size:14px;">
                Reply on WhatsApp
              </a>
            </div>
          </div>
        `
      );

      // 2. Send a welcome/confirmation email to the guest, only if they left an email.
      // Resend's shared testing domain can only deliver to the account's own verified
      // email until a real domain is purchased and verified, so this is wrapped in its
      // own try/catch — a failure here should NOT fail the whole enquiry submission.
      if (email) {
        try {
          await sendEmail(
            email,
            "We've received your enquiry — Royal Abidal Guesthouse",
            `
              <div style="text-align:center; margin-bottom: 20px;">
                <img src="${LOGO_URL}" alt="Royal Abidal Guesthouse" style="max-width: 160px; height: auto;">
              </div>
              <h2>Hi ${name}, thanks for reaching out!</h2>
              <p>We've received your enquiry for <strong>${location || "one of our locations"}</strong> and will get back to you shortly to confirm availability.</p>
              <p>If it's urgent, feel free to message us directly on WhatsApp at
                <a href="https://wa.me/27649112644">+27 64 911 2644</a>.
              </p>
              <p>Warm regards,<br>Royal Abidal Guesthouse</p>
            `
          );
        } catch (guestEmailErr) {
          console.error("Guest confirmation email failed (expected until domain is verified):", guestEmailErr);
          // Don't rethrow — the enquiry itself still succeeded via the admin email above.
        }
      }

      return Response.json({ success: true });
    } catch (err) {
      console.error("send-enquiry error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to process enquiry." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-enquiry' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Test","phone":"0821234567","email":"you@example.com","location":"Ighina Street","message":"Testing"}'

*/