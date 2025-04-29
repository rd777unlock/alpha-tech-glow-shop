
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PAYMENT_API_KEY = Deno.env.get("PAYMENT_API_KEY") || "sk_MiPcpHOVy02JdXmEUN8OWq-bQNbn4u_D09lNNfA8LX0Q-Vo_";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId, paymentMethod } = await req.json();
    
    if (!paymentId) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Verifying payment: ${paymentId}, method: ${paymentMethod}`);
    
    // In a real implementation, you would make a request to your payment gateway API
    // For demonstration purposes, we'll simulate a response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly determine if payment is successful (for demo purposes)
    // In a real implementation, you would check with your payment provider
    const isApproved = Math.random() > 0.3; // 70% chance of success for demo
    
    let paymentData = {
      id: paymentId,
      status: isApproved ? "approved" : "pending",
      method: paymentMethod,
      details: {}
    };
    
    // Add method-specific details
    if (paymentMethod === "pix") {
      paymentData.details = {
        qrCodeImage: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
        qrCodeText: "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b70b-8ce14f70e3c5520400005303986540510.005802BR5925ALPHA TECH PAGAMENTOS SA6009SAO PAULO62070503***6304E2CA",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
      };
    } else if (paymentMethod === "boleto") {
      paymentData.details = {
        barcode: "34191.79001 01043.510047 91020.150008 7 91870000002000",
        boletoUrl: "https://example.com/boleto/12345",
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment: paymentData 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
