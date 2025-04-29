import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
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
    const paymentRequest: PaymentRequest = await req.json();

    // Validate required fields
    if (
      !paymentRequest.orderNumber ||
      !paymentRequest.amount ||
      !paymentRequest.paymentMethod ||
      !paymentRequest.customerName ||
      !paymentRequest.customerEmail
    ) {
      throw new Error("Campos obrigatórios faltando");
    }

    // Validate amount
    if (paymentRequest.amount <= 0) {
      throw new Error("Valor inválido");
    }

    // Validate card details for credit card payments
    if (paymentRequest.paymentMethod === "credit") {
      if (
        !paymentRequest.cardDetails?.number ||
        !paymentRequest.cardDetails?.name ||
        !paymentRequest.cardDetails?.expiry ||
        !paymentRequest.cardDetails?.cvv
      ) {
        throw new Error("Dados do cartão incompletos");
      }

      // Additional card validation would go here
      // In a real implementation, this would be handled by the payment gateway
    }

    // Get payment API keys from database
    const { data: paymentSettings, error: settingsError } =
      await req.supabaseClient
        .from("payment_settings")
        .select("*")
        .limit(1)
        .single();

    if (settingsError) {
      throw new Error(
        `Erro ao obter configurações de pagamento: ${settingsError.message}`,
      );
    }

    const { public_key, private_key } = paymentSettings;

    // In a real implementation, we would make an API call to a payment processor
    // For this demo, we'll simulate different responses based on payment method

    let paymentResponse;

    switch (paymentRequest.paymentMethod) {
      case "credit":
        // Simulate credit card payment processing
        // In a real app, we would validate the card and process the payment

        // Simulate card validation (last 4 digits check for demo)
        const cardNumber = paymentRequest.cardDetails?.number || "";
        const last4 = cardNumber.slice(-4);

        // For demo: cards ending with 1111 are declined, others are approved
        const isApproved = last4 !== "1111";

        paymentResponse = {
          success: isApproved,
          paymentId: `pay_${Date.now()}`,
          status: isApproved ? "approved" : "declined",
          message: isApproved ? "Pagamento aprovado" : "Cartão recusado",
          transactionDetails: {
            cardLast4: last4,
            authCode: isApproved
              ? `AUTH${Math.floor(Math.random() * 1000000)}`
              : null,
          },
        };
        break;

      case "pix":
        // Simulate PIX payment generation
        // In a real app, we would generate a PIX code through the payment gateway

        // Generate a fake PIX code and QR code URL
        const pixCode = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}5204000053039865802BR5913Alpha Tech BR6008Sao Paulo62090505${paymentRequest.orderNumber}6304${Math.floor(Math.random() * 10000)}`;

        // In a real app, this would be a URL to an actual QR code image
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;

        paymentResponse = {
          success: true,
          paymentId: `pix_${Date.now()}`,
          status: "pending",
          message: "Pagamento PIX gerado com sucesso",
          transactionDetails: {
            pixCode,
            qrCodeUrl,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          },
        };
        break;

      case "boleto":
        // Simulate boleto generation
        // In a real app, we would generate a boleto through the payment gateway

        // Generate a fake boleto number and barcode
        const boletoNumber =
          `34191.79001 01043.510047 91020.150008 9 ${Math.floor(Math.random() * 10000000000)}`.replace(
            /\s/g,
            "",
          );

        // In a real app, this would be a URL to an actual boleto PDF
        const boletoUrl = `https://example.com/boletos/${boletoNumber}.pdf`;

        paymentResponse = {
          success: true,
          paymentId: `bol_${Date.now()}`,
          status: "pending",
          message: "Boleto gerado com sucesso",
          transactionDetails: {
            boletoNumber,
            boletoUrl,
            barCode: boletoNumber,
            expiresAt: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 3 days
          },
        };
        break;

      default:
        throw new Error("Método de pagamento não suportado");
    }

    // Store payment information in the database
    const { error: orderError } = await req.supabaseClient
      .from("orders")
      .upsert(
        {
          order_number: paymentRequest.orderNumber,
          customer_name: paymentRequest.customerName,
          customer_email: paymentRequest.customerEmail,
          total_amount: paymentRequest.amount,
          payment_method: paymentRequest.paymentMethod,
          payment_status: paymentResponse.status,
          payment_details: paymentResponse.transactionDetails,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "order_number" },
      );

    if (orderError) {
      console.error("Error updating order:", orderError);
    }

    return new Response(JSON.stringify(paymentResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment processing error:", error);

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
