import { useOrderStatus } from "@/hooks/use-order-status";
import { PaymentStatus } from "./payment-status";
import { Skeleton } from "./skeleton";

interface OrderStatusProps {
  orderNumber: string;
  className?: string;
}

export function OrderStatus({ orderNumber, className }: OrderStatusProps) {
  const { status, isLoading, error } = useOrderStatus(orderNumber);

  if (isLoading) {
    return <Skeleton className="h-8 w-32" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Erro ao carregar status</div>;
  }

  return (
    <PaymentStatus
      status={status as "pending" | "approved" | "declined" | "failed"}
      className={className}
    />
  );
}
