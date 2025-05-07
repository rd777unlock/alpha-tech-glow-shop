export interface PaymentRequest {
  amount: number;
  paymentMethod: "pix" | "credit_card" | "boleto";
  items: {
    title: string;
    unitPrice: number;
    quantity: number;
    tangible: boolean;
    externalRef: string;
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    document: {
      number: string;
      type: "cpf";
    };
  };
  externalRef: string;
}

export interface PaymentResponse {
  status: "waiting_payment" | "pending" | "approved" | "refused" | "paid" | "cancelled";
  paymentId: string;
  message: string;
  pixQrCode?: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoNumber?: string;
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
