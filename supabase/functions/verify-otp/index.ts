import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyOtpRequest {
  email: string;
  otp: string;
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
    const { email, otp }: VerifyOtpRequest = await req.json();

    if (!email || !otp) {
      throw new Error("Email e código OTP são obrigatórios");
    }

    // Get the stored OTP for this email
    const { data: otpData, error: otpError } = await req.supabaseClient
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      throw new Error("Código OTP não encontrado");
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpData.expires_at);
    if (expiresAt < new Date()) {
      throw new Error("Código OTP expirado");
    }

    // Verify OTP
    if (otpData.code !== otp) {
      throw new Error("Código OTP inválido");
    }

    // Delete the used OTP
    await req.supabaseClient.from("otp_codes").delete().eq("id", otpData.id);

    return new Response(
      JSON.stringify({
        valid: true,
        message: "Código OTP verificado com sucesso",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);

    return new Response(
      JSON.stringify({
        valid: false,
        error: error.message || "Erro desconhecido",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
