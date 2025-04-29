import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  validateCardNumber,
  validateCardExpiry,
  validateCardCVV,
} from "@/lib/payment";

const cardSchema = z.object({
  number: z
    .string()
    .min(13, "Número do cartão inválido")
    .max(19, "Número do cartão inválido")
    .refine(validateCardNumber, "Número do cartão inválido"),
  name: z.string().min(3, "Nome inválido"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Data inválida (MM/YY)")
    .refine(validateCardExpiry, "Data expirada"),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, "CVV inválido")
    .refine(validateCardCVV, "CVV inválido"),
});

type CardFormValues = z.infer<typeof cardSchema>;

interface CreditCardFormProps {
  onSubmit: (data: CardFormValues) => void;
  isSubmitting?: boolean;
}

export function CreditCardForm({
  onSubmit,
  isSubmitting,
}: CreditCardFormProps) {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      number: "",
      name: "",
      expiry: "",
      cvv: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value
                      .replace(/\s/g, "")
                      .replace(/(.{4})/g, "$1 ")
                      .trim();
                    field.onChange(value);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome no Cartão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MM/YY"
                    maxLength={5}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2);
                      }
                      field.onChange(value);
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
