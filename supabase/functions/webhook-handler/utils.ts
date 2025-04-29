import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const hmac = createHmac("sha256", secret);
    const expectedSignature = hmac.update(payload).toString("hex");
    return signature === expectedSignature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

export function generateWebhookResponse(
  success: boolean,
  message: string,
  status: number = 200,
) {
  return new Response(JSON.stringify({ success, message }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Content-Type": "application/json",
    },
    status,
  });
}
