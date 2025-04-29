import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OtpRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { email }: OtpRequest = await req.json();

    if (!email) {
      throw new Error("Email é obrigatório");
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database with expiration
    const { error: storeError } = await req.supabaseClient
      .from("otp_codes")
      .upsert({
        email,
        code: otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiration
      });

    if (storeError) {
      throw new Error(`Erro ao armazenar código OTP: ${storeError.message}`);
    }

    // In a real application, send the email with the OTP
    console.log(`OTP for ${email}: ${otp}`);

    // For demo purposes, we'll just log the OTP and return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Código OTP enviado com sucesso",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error sending OTP:", error);

    return new Response(
      JSON.stringify({ error: error.message || "Erro desconhecido" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
