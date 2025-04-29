import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStatusProps {
  status: "pending" | "approved" | "declined" | "failed";
  message?: string;
  className?: string;
}

export function PaymentStatus({
  status,
  message,
  className,
}: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
      label: "Pendente",
    },
    approved: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
      label: "Aprovado",
    },
    declined: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
      label: "Recusado",
    },
    failed: {
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
      label: "Falhou",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("p-1 rounded-full", config.bgColor)}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      <div className="flex flex-col">
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
        {message && <span className="text-xs text-gray-400">{message}</span>}
      </div>
    </div>
  );
}
