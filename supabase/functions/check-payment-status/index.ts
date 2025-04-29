import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusRequest {
  orderNumber: string;
  paymentId: string;
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
    const { orderNumber, paymentId }: StatusRequest = await req.json();

    if (!orderNumber || !paymentId) {
      throw new Error("Número do pedido e ID do pagamento são obrigatórios");
    }

    // Get order from database
    const { data: order, error: orderError } = await req.supabaseClient
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      throw new Error("Pedido não encontrado");
    }

    // In a real app, we would check with the payment gateway for the current status
    // For this demo, we'll simulate different responses

    let paymentStatus;
    let statusMessage;

    if (order.payment_method === "pix") {
      // For PIX, randomly decide if payment was received (70% chance of success)
      const isReceived = Math.random() < 0.7;

      paymentStatus = isReceived ? "approved" : "pending";
      statusMessage = isReceived
        ? "Pagamento PIX recebido"
        : "Aguardando pagamento PIX";

      // Update order status if payment was received
      if (isReceived && order.payment_status !== "approved") {
        await req.supabaseClient
          .from("orders")
          .update({
            payment_status: "approved",
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber);
      }
    } else if (order.payment_method === "boleto") {
      // For boleto, randomly decide if payment was received (30% chance of success)
      const isReceived = Math.random() < 0.3;

      paymentStatus = isReceived ? "approved" : "pending";
      statusMessage = isReceived
        ? "Pagamento do boleto recebido"
        : "Aguardando pagamento do boleto";

      // Update order status if payment was received
      if (isReceived && order.payment_status !== "approved") {
        await req.supabaseClient
          .from("orders")
          .update({
            payment_status: "approved",
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber);
      }
    } else {
      // For credit card, use the stored status
      paymentStatus = order.payment_status;
      statusMessage =
        paymentStatus === "approved"
          ? "Pagamento aprovado"
          : "Pagamento recusado";
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        paymentId,
        status: paymentStatus,
        message: statusMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error checking payment status:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro desconhecido",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
