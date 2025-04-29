import { CreditCard, Banknotes, QrCode } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PaymentMethodSelector({
  value,
  onValueChange,
}: PaymentMethodSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div>
        <RadioGroupItem value="credit" id="credit" className="peer sr-only" />
        <Label
          htmlFor="credit"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-alphadarkblue p-4 hover:bg-alphadarkblue/80 cursor-pointer peer-data-[state=checked]:border-alphablue transition-colors"
        >
          <CreditCard className="mb-2 h-6 w-6 text-alphablue" />
          <span className="text-sm font-medium">Cartão de Crédito</span>
          <span className="text-xs text-gray-400 mt-1">Até 12x sem juros</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
        <Label
          htmlFor="pix"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-alphadarkblue p-4 hover:bg-alphadarkblue/80 cursor-pointer peer-data-[state=checked]:border-alphablue transition-colors"
        >
          <QrCode className="mb-2 h-6 w-6 text-alphablue" />
          <span className="text-sm font-medium">PIX</span>
          <span className="text-xs text-gray-400 mt-1">Aprovação imediata</span>
        </Label>
      </div>

      <div>
        <RadioGroupItem value="boleto" id="boleto" className="peer sr-only" />
        <Label
          htmlFor="boleto"
          className="flex flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-alphadarkblue p-4 hover:bg-alphadarkblue/80 cursor-pointer peer-data-[state=checked]:border-alphablue transition-colors"
        >
          <Banknotes className="mb-2 h-6 w-6 text-alphablue" />
          <span className="text-sm font-medium">Boleto</span>
          <span className="text-xs text-gray-400 mt-1">Até 3 dias úteis</span>
        </Label>
      </div>
    </RadioGroup>
  );
}
