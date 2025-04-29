import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useOrderStatus(orderNumber: string) {
  const [status, setStatus] = useState<string>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const channel = supabase
      .channel(`order-${orderNumber}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_number=eq.${orderNumber}`,
        },
        (payload) => {
          const newStatus = payload.new.payment_status;
          setStatus(newStatus);

          if (newStatus === "approved") {
            toast({
              title: "Pagamento confirmado!",
              description: "Seu pedido foi aprovado e está sendo processado.",
            });
          } else if (newStatus === "failed" || newStatus === "declined") {
            toast({
              title: "Pagamento não aprovado",
              description: "Houve um problema com seu pagamento.",
              variant: "destructive",
            });
          }
        },
      )
      .subscribe();

    // Initial status fetch
    fetchOrderStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  const fetchOrderStatus = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("payment_status")
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;
      if (data) setStatus(data.payment_status);
    } catch (err) {
      console.error("Error fetching order status:", err);
      setError(
        err instanceof Error ? err.message : "Error fetching order status",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { status, isLoading, error, refetch: fetchOrderStatus };
}
