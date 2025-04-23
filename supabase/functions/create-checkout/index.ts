
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
    console.error("Missing environment variable: POLAR_API_KEY");
    throw new Error("POLAR_API_KEY is not set in the environment");
  }

  console.log(`Creating Polar checkout for plan: ${planId}, amount: ${amountCents}, email: ${email}`);

  try {
    // Call Polar API to create a checkout session
    const response = await fetch("https://api.polar.sh/v1/checkout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount_cents: amountCents,
        email: email,
        success_url: `${Deno.env.get("SITE_URL") || "https://ettrfzupsducalseyyzd.supabase.co"}/dashboard`,
        cancel_url: `${Deno.env.get("SITE_URL") || "https://ettrfzupsducalseyyzd.supabase.co"}/subscription`,
        metadata: {
          plan_id: planId
        }
      }),
    });

    console.log(`Polar API response status: ${response.status}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Polar API Error Response:", data);
      throw new Error(`Polar API error (${response.status}): ${data.detail || data.message || JSON.stringify(data)}`);
    }

    console.log("Polar checkout created:", data);
    return data;
  } catch (error) {
    console.error("Error creating Polar checkout:", error.message);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log API key existence (not the actual key)
    console.log(`POLAR_API_KEY exists: ${!!Deno.env.get("POLAR_API_KEY")}`);
    
    // Parse request body
    const { plan_id, amount, email } = await req.json();

    if (!plan_id || !amount) {
      return new Response(
        JSON.stringify({ error: "plan_id and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing checkout request for plan: ${plan_id}, amount: ${amount}, email: ${email}`);

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
