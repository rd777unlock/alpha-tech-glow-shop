export interface PaymentRequest {
  orderNumber: string;
  amount: number;
  paymentMethod: "credit" | "pix" | "boleto";
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: "pending" | "approved" | "declined" | "failed";
  message: string;
  transactionDetails?: {
    cardLast4?: string;
    authCode?: string;
    pixCode?: string;
    qrCodeUrl?: string;
    boletoNumber?: string;
    boletoUrl?: string;
    expiresAt?: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  orderNumber: string;
  paymentId: string;
  status: "pending" | "approved" | "declined" | "failed";
  message: string;
}

export interface WebhookPayload {
  event: string;
  data: {
    order_number: string;
    payment_id: string;
    status: string;
    details: Record<string, any>;
  };
}
