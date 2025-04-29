import { useState } from "react";
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatusResponse,
} from "@/types/payment";
import { processPayment, checkPaymentStatus } from "@/lib/payment";
import { toast } from "@/hooks/use-toast";

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);

  const handlePayment = async (request: PaymentRequest) => {
    setIsProcessing(true);
    try {
      const response = await processPayment(request);
      setPaymentResponse(response);

      if (response.status === "approved") {
        toast({
          title: "Pagamento aprovado!",
          description: "Seu pedido foi confirmado.",
        });
      } else if (response.status === "declined") {
        toast({
          title: "Pagamento recusado",
          description: response.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento pendente",
          description: response.message,
        });
      }

      return response;
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao processar pagamento",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusCheck = async (orderNumber: string, paymentId: string) => {
    setIsCheckingStatus(true);
    try {
      const response = await checkPaymentStatus(orderNumber, paymentId);

      if (response.status === "approved") {
        toast({
          title: "Pagamento confirmado!",
          description:
            "Seu pagamento foi recebido e seu pedido foi confirmado.",
        });
      } else if (
        response.status === "declined" ||
        response.status === "failed"
      ) {
        toast({
          title: "Pagamento não aprovado",
          description: response.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pagamento pendente",
          description:
            "Ainda não recebemos a confirmação do seu pagamento. Por favor, tente novamente em alguns instantes.",
        });
      }

      return response;
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao verificar status do pagamento",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return {
    isProcessing,
    isCheckingStatus,
    paymentResponse,
    handlePayment,
    handleStatusCheck,
  };
}
