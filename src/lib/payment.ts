import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from "@/types/payment";

export async function processPayment(
  paymentRequest: PaymentRequest,
): Promise<PaymentResponse> {
  try {
    const response = await fetch("/api/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentRequest),
    });
    if (!response.ok) throw new Error("Erro ao processar pagamento");
    return await response.json();
  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao processar pagamento",
    );
  }
}

export async function checkPaymentStatus(
  orderNumber: string,
  paymentId: string,
): Promise<PaymentStatusResponse> {
  try {
    const response = await fetch("/api/check-payment-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, paymentId }),
    });
    if (!response.ok) throw new Error("Erro ao consultar status do pagamento");
    return await response.json();
  } catch (error) {
    console.error("Payment status check error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao verificar status do pagamento",
    );
  }
}

export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    declined: "Recusado",
    failed: "Falhou",
  };

  return statusMap[status] || status;
}

export function validateCardNumber(number: string): boolean {
  // Remove any spaces or dashes
  const cleanNumber = number.replace(/[\s-]/g, "");

  // Check if the number contains only digits
  if (!/^\d+$/.test(cleanNumber)) return false;

  // Check length (most card numbers are between 13 and 19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  // Loop through values starting from the rightmost one
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateCardExpiry(expiry: string): boolean {
  // Expected format: MM/YY
  const match = expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!match) return false;

  const month = parseInt(match[1]);
  const year = parseInt("20" + match[2]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

export function validateCardCVV(cvv: string): boolean {
  // CVV should be 3 or 4 digits
  return /^[0-9]{3,4}$/.test(cvv);
}
