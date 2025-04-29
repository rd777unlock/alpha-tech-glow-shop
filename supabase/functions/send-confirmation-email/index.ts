
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { email, name, orderNumber, totalAmount, paymentMethod, items } = await req.json();
    
    if (!email || !orderNumber) {
      return new Response(
        JSON.stringify({ success: false, error: "Email and order number are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Sending confirmation email to ${email} for order ${orderNumber}`);
    
    // In a real implementation, you would send an actual email using a service like SendGrid, Resend, etc.
    // For demonstration purposes, we'll just log the details and return success
    
    // Example email template (would be HTML in production)
    const emailContent = `
      Olá ${name || 'cliente'},
      
      Obrigado por sua compra na Alpha Tech BR!
      
      Detalhes do pedido:
      Número do pedido: ${orderNumber}
      Total: R$ ${totalAmount.toFixed(2)}
      Método de pagamento: ${paymentMethod}
      
      Itens:
      ${items?.map(item => `- ${item.name} x${item.quantity}: R$ ${item.price * item.quantity}`).join('\n') || 'N/A'}
      
      Acompanhe seu pedido pelo site ou entre em contato pelo WhatsApp: 13 99611-4479
      
      Atenciosamente,
      Equipe Alpha Tech BR
      loja.alphatechbr@gmail.com
    `;
    
    console.log("Email content would be:", emailContent);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return new Response(
      JSON.stringify({ success: true, message: `Email de confirmação simulado para ${email}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
