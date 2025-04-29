import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { verifyWebhookSignature, generateWebhookResponse } from "./utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get("x-webhook-signature");
    if (!signature) {
      throw new Error("Missing webhook signature");
    }

    // Get webhook secret from database
    const { data: paymentSettings, error: settingsError } =
      await req.supabaseClient
        .from("payment_settings")
        .select("webhook_secret")
        .limit(1)
        .single();

    if (settingsError) {
      throw new Error(
        `Erro ao obter configurações de webhook: ${settingsError.message}`,
      );
    }

    const webhookSecret = paymentSettings.webhook_secret;
    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    // Verify webhook signature
    // In a real implementation, this would use crypto to verify HMAC
    const isValid = verifyWebhookSignature(
      await req.clone().text(),
      signature,
      webhookSecret,
    );
    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    // Parse the webhook payload
    const payload = await req.json();
    console.log("Received webhook payload:", payload);

    // Process different webhook event types
    if (payload.event === "payment.succeeded") {
      // Update order status to approved
      const { data, error } = await req.supabaseClient
        .from("orders")
        .update({
          payment_status: "approved",
          updated_at: new Date().toISOString(),
          payment_details: {
            ...payload.data,
            webhook_received: true,
            webhook_timestamp: new Date().toISOString(),
          },
        })
        .eq("order_number", payload.data.order_number);

      if (error) {
        throw new Error(`Erro ao atualizar pedido: ${error.message}`);
      }

      // In a real app, we would send a confirmation email to the customer
    } else if (payload.event === "payment.failed") {
      // Update order status to failed
      const { data, error } = await req.supabaseClient
        .from("orders")
        .update({
          payment_status: "failed",
          updated_at: new Date().toISOString(),
          payment_details: {
            ...payload.data,
            webhook_received: true,
            webhook_timestamp: new Date().toISOString(),
          },
        })
        .eq("order_number", payload.data.order_number);

      if (error) {
        throw new Error(`Erro ao atualizar pedido: ${error.message}`);
      }

      // In a real app, we would notify the customer about the failed payment
    }

    return generateWebhookResponse(true, "Webhook processed successfully");
  } catch (error) {
    console.error("Webhook processing error:", error);

    return generateWebhookResponse(
      false,
      error.message || "Erro desconhecido",
      400,
    );
  }
});
