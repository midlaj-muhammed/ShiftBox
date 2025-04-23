
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Setup function to create a Polar checkout session
async function createPolarCheckout(planId: string, amountCents: number, email: string) {
  // Get API key from environment
  const apiKey = Deno.env.get("POLAR_API_KEY");
  
  if (!apiKey) {
    throw new Error("POLAR_API_KEY is not set in the environment");
  }

  // Call Polar API to create a checkout session
  const response = await fetch("https://api.polar.sh/api/public/v1/payment-links", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      amount_cents: amountCents,
      email: email,
      success_url: `${Deno.env.get("SITE_URL") || "https://ettrfzupsducalseyyzd.supabase.co"}/dashboard`,
      cancel_url: `${Deno.env.get("SITE_URL") || "https://ettrfzupsducalseyyzd.supabase.co"}/subscription`,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Polar API error: ${data.message || JSON.stringify(data)}`);
  }

  console.log("Polar checkout created:", data);
  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { plan_id, amount, email } = await req.json();

    if (!plan_id || !amount) {
      return new Response(
        JSON.stringify({ error: "plan_id and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Polar checkout session
    const checkout = await createPolarCheckout(plan_id, amount, email);

    // Return the checkout URL to redirect the user
    return new Response(
      JSON.stringify({ url: checkout.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Create checkout error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
