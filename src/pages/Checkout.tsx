import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "../hooks/use-toast";
import {
  Loader2,
  LockIcon,
  CreditCard,
  CheckIcon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { usePayment } from "@/hooks/use-payment";

// Create a schema for the form validation
const formSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP inválido"),
  paymentMethod: z.enum(["credit", "pix", "boleto"]),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

enum CheckoutStep {
  PersonalData = 0,
  Payment = 1,
  Confirmation = 2,
}

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(
    CheckoutStep.PersonalData,
  );
  const [orderNumber, setOrderNumber] = useState<string>(
    `ALF${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`,
  );
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [pixQrCode, setPixQrCode] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [boletoUrl, setBoletoUrl] = useState("");
  const [boletoNumber, setBoletoNumber] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "credit",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const { watch, trigger, getValues } = form;
  const paymentMethod = watch("paymentMethod");
  const { handleStatusCheck, isCheckingStatus } = usePayment();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleNextStep = async () => {
    if (currentStep === CheckoutStep.PersonalData) {
      // Validate personal data form fields
      const isValid = await trigger([
        "name",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
      ]);

      if (isValid) {
        setCurrentStep(CheckoutStep.Payment);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === CheckoutStep.Payment) {
      // Validate payment related fields
      let isValid = await trigger(["paymentMethod"]);

      if (paymentMethod === "credit") {
        isValid =
          isValid &&
          (await trigger(["cardNumber", "cardName", "cardExpiry", "cardCvv"]));
      }

      if (isValid) {
        setCurrentStep(CheckoutStep.Confirmation);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Simulate payment processing
  const processPayment = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Attempt to send confirmation email
      try {
        // Simulate sending confirmation email
        console.log("Sending confirmation email to:", data.email);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      // For demo purposes, pretend the payment was processed successfully
      toast({
        title: "Pagamento processado com sucesso!",
        description: "Seu pedido foi confirmado.",
      });

      // Clear the cart after successful checkout
      clearCart();

      // Redirect to success page
      navigate("/checkout/success");
    } catch (error) {
      toast({
        title: "Erro no processamento do pagamento",
        description:
          "Por favor, tente novamente ou use outro método de pagamento.",
        variant: "destructive",
      });
      setCurrentStep(CheckoutStep.Payment);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          amount: getCartTotal(),
          paymentMethod: data.paymentMethod,
          customer: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          card: data.paymentMethod === "credit" ? {
            number: data.cardNumber,
            name: data.cardName,
            expiry: data.cardExpiry,
            cvv: data.cardCvv,
          } : undefined,
          cart: cartItems.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.discount
              ? Math.round(item.product.price * (1 - item.product.discount / 100))
              : item.product.price,
            quantity: item.quantity,
          })),
        }),
      });
      const result = await response.json();
      setPaymentResponse(result);
      if (data.paymentMethod === "pix") {
        setPixQrCode(result.pixQrCode || "");
        setPixCode(result.pixCode || "");
        if (result.status === "approved") {
          clearCart();
          navigate("/checkout/success", { state: { orderNumber, paymentMethod: "pix", total: getCartTotal() } });
          return;
        }
      }
      if (data.paymentMethod === "boleto") {
        setBoletoUrl(result.boletoUrl || "");
        setBoletoNumber(result.boletoNumber || "");
      }
      if (data.paymentMethod === "credit" && result.status === "approved") {
        clearCart();
        navigate("/checkout/success", { state: { orderNumber, paymentMethod: "credit", total: getCartTotal() } });
        return;
      }
    } catch (error) {
      toast({ title: "Erro ao processar pagamento", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-alphablue/10 rounded-lg p-4 mb-8 flex items-center">
              <LockIcon className="text-alphablue mr-2" />
              <span className="text-white">
                Checkout seguro - Seus dados estão protegidos
              </span>
            </div>

            {/* Checkout Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= CheckoutStep.PersonalData ? "bg-alphablue text-white" : "bg-gray-600 text-gray-300"}`}
                  >
                    1
                  </div>
                  <span className="text-sm text-white mt-2">Dados</span>
                </div>

                <div
                  className={`h-1 flex-grow mx-2 ${currentStep >= CheckoutStep.Payment ? "bg-alphablue" : "bg-gray-600"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= CheckoutStep.Payment ? "bg-alphablue text-white" : "bg-gray-600 text-gray-300"}`}
                  >
                    2
                  </div>
                  <span className="text-sm text-white mt-2">Pagamento</span>
                </div>

                <div
                  className={`h-1 flex-grow mx-2 ${currentStep >= CheckoutStep.Confirmation ? "bg-alphablue" : "bg-gray-600"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${currentStep >= CheckoutStep.Confirmation ? "bg-alphablue text-white" : "bg-gray-600 text-gray-300"}`}
                  >
                    3
                  </div>
                  <span className="text-sm text-white mt-2">Confirmação</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-alphadarkblue rounded-xl p-6 mb-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleConfirmPayment)}
                      className="space-y-6"
                    >
                      {/* Step 1: Personal Data */}
                      {currentStep === CheckoutStep.PersonalData && (
                        <>
                          <h2 className="text-xl text-white font-medium mb-6">
                            Informações de Entrega
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome Completo</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Seu nome completo"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="seu@email.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="(11) 99999-9999"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Rua, número, complemento"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Sua cidade"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estado</FormLabel>
                                  <FormControl>
                                    <Input placeholder="UF" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CEP</FormLabel>
                                  <FormControl>
                                    <Input placeholder="00000-000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="pt-6 flex justify-end">
                            <Button
                              type="button"
                              className="bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg h-auto hover:opacity-90 transition-opacity flex items-center"
                              onClick={handleNextStep}
                            >
                              Próximo: Pagamento
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Step 2: Payment */}
                      {currentStep === CheckoutStep.Payment && (
                        <>
                          <h2 className="text-xl text-white font-medium mb-6">
                            Método de Pagamento
                          </h2>

                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    className="flex flex-col space-y-4"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <div
                                      className={`border ${field.value === "credit" ? "border-alphablue" : "border-gray-600"} rounded-lg p-4 transition-colors`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="credit"
                                          id="credit"
                                        />
                                        <FormLabel
                                          htmlFor="credit"
                                          className="flex items-center gap-2 cursor-pointer"
                                        >
                                          <CreditCard className="h-5 w-5" />
                                          <span>Cartão de Crédito</span>
                                        </FormLabel>
                                      </div>

                                      {field.value === "credit" && (
                                        <div className="mt-4 space-y-4">
                                          <FormField
                                            control={form.control}
                                            name="cardNumber"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Número do Cartão
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="0000 0000 0000 0000"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <FormField
                                            control={form.control}
                                            name="cardName"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>
                                                  Nome no Cartão
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    placeholder="Como está no cartão"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />

                                          <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                              control={form.control}
                                              name="cardExpiry"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>
                                                    Validade
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="MM/AA"
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />

                                            <FormField
                                              control={form.control}
                                              name="cardCvv"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>CVV</FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="123"
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      className={`border ${field.value === "pix" ? "border-alphablue" : "border-gray-600"} rounded-lg p-4 transition-colors`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pix" id="pix" />
                                        <FormLabel
                                          htmlFor="pix"
                                          className="flex items-center gap-2 cursor-pointer"
                                        >
                                          <img
                                            src="https://logospng.org/download/pix/logo-pix-512.png"
                                            alt="Pix"
                                            className="h-5 w-5"
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.src =
                                                "https://placehold.co/20x20/alphadark/gray?text=PIX";
                                            }}
                                          />
                                          <span>Pix</span>
                                        </FormLabel>
                                      </div>

                                      {field.value === "pix" && (
                                        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-center">
                                          <p className="text-gray-300 mb-2">
                                            Finalize a compra para gerar o
                                            código Pix
                                          </p>
                                          <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-2" />
                                          <p className="text-gray-300 text-sm">
                                            O código Pix será gerado na próxima
                                            etapa
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      className={`border ${field.value === "boleto" ? "border-alphablue" : "border-gray-600"} rounded-lg p-4 transition-colors`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value="boleto"
                                          id="boleto"
                                        />
                                        <FormLabel
                                          htmlFor="boleto"
                                          className="flex items-center gap-2 cursor-pointer"
                                        >
                                          <img
                                            src="https://logospng.org/download/boleto-bancario/logo-boleto-bancario-256.png"
                                            alt="Boleto"
                                            className="h-5 w-5"
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.src =
                                                "https://placehold.co/20x20/alphadark/gray?text=BOLETO";
                                            }}
                                          />
                                          <span>Boleto Bancário</span>
                                        </FormLabel>
                                      </div>

                                      {field.value === "boleto" && (
                                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                                          <p className="text-gray-300 mb-2">
                                            Informações importantes:
                                          </p>
                                          <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                                            <li>
                                              O boleto será gerado na próxima
                                              etapa
                                            </li>
                                            <li>
                                              Prazo de até 3 dias úteis para
                                              compensação
                                            </li>
                                            <li>
                                              Produtos liberados após
                                              confirmação do pagamento
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-6 flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePreviousStep}
                              className="py-3 px-6 rounded-lg h-auto flex items-center"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Voltar: Dados
                            </Button>

                            <Button
                              type="button"
                              className="bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg h-auto hover:opacity-90 transition-opacity flex items-center"
                              onClick={handleNextStep}
                            >
                              Próximo: Confirmar
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Step 3: Confirmation */}
                      {currentStep === CheckoutStep.Confirmation && (
                        <>
                          <h2 className="text-xl text-white font-medium mb-6">
                            Confirmação do Pedido
                          </h2>

                          <div className="space-y-6">
                            <div className="bg-alphadark rounded-lg p-4">
                              <h3 className="text-white font-medium mb-3">
                                Dados de Entrega
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-400">Nome:</p>
                                  <p className="text-white">
                                    {getValues("name")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Email:</p>
                                  <p className="text-white">
                                    {getValues("email")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Telefone:</p>
                                  <p className="text-white">
                                    {getValues("phone")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Endereço:</p>
                                  <p className="text-white">
                                    {getValues("address")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">
                                    Cidade/Estado:
                                  </p>
                                  <p className="text-white">
                                    {getValues("city")}/{getValues("state")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">CEP:</p>
                                  <p className="text-white">
                                    {getValues("zipCode")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-alphadark rounded-lg p-4">
                              <h3 className="text-white font-medium mb-3">
                                Método de Pagamento
                              </h3>
                              <div className="flex items-center gap-2">
                                {paymentMethod === "credit" && (
                                  <>
                                    <CreditCard className="text-alphablue h-5 w-5" />
                                    <p className="text-white">
                                      Cartão de Crédito terminando em{" "}
                                      {getValues("cardNumber")?.slice(-4) ||
                                        "****"}
                                    </p>
                                  </>
                                )}

                                {paymentMethod === "pix" && (
                                  <>
                                    <img
                                      src="https://logospng.org/download/pix/logo-pix-512.png"
                                      alt="Pix"
                                      className="h-5 w-5"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src =
                                          "https://placehold.co/20x20/alphadark/gray?text=PIX";
                                      }}
                                    />
                                    <p className="text-white">
                                      Pagamento via Pix
                                    </p>
                                  </>
                                )}

                                {paymentMethod === "boleto" && (
                                  <>
                                    <img
                                      src="https://logospng.org/download/boleto-bancario/logo-boleto-bancario-256.png"
                                      alt="Boleto"
                                      className="h-5 w-5"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src =
                                          "https://placehold.co/20x20/alphadark/gray?text=BOLETO";
                                      }}
                                    />
                                    <p className="text-white">
                                      Pagamento via Boleto Bancário
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="bg-alphadark rounded-lg p-4">
                              <h3 className="text-white font-medium mb-3">
                                Itens do Pedido
                              </h3>
                              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                {cartItems.map((item) => {
                                  const discountedPrice = item.product.discount
                                    ? Math.round(
                                        item.product.price *
                                          (1 - item.product.discount / 100),
                                      )
                                    : item.product.price;

                                  return (
                                    <div
                                      key={item.product.id}
                                      className="flex gap-3 pb-3 border-b border-gray-700"
                                    >
                                      <div className="w-12 h-12">
                                        <img
                                          src={item.product.imageUrl}
                                          alt={item.product.name}
                                          className="w-full h-full object-cover rounded-md"
                                          onError={(e) => {
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.src =
                                              "https://placehold.co/48x48/alphadark/gray?text=Imagem+Indisponível";
                                          }}
                                        />
                                      </div>

                                      <div className="flex-grow">
                                        <h4 className="text-white text-sm">
                                          {item.product.name}
                                        </h4>
                                        <div className="flex justify-between items-center mt-1">
                                          <span className="text-gray-400 text-xs">
                                            Qtd: {item.quantity}
                                          </span>
                                          <span className="text-white text-sm">
                                            {formatPrice(
                                              discountedPrice * item.quantity,
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-700">
                                <div className="flex justify-between">
                                  <span className="text-gray-300">
                                    Subtotal:
                                  </span>
                                  <span className="text-white">
                                    {formatPrice(getCartTotal())}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Frete:</span>
                                  <span className="text-alphablue">Grátis</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2">
                                  <span className="text-white">Total:</span>
                                  <span className="text-white">
                                    {formatPrice(getCartTotal())}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-6 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreviousStep}
                                className="py-3 px-6 rounded-lg h-auto flex items-center"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar: Pagamento
                              </Button>

                              {paymentResponse &&
                              watch("paymentMethod") === "pix" ? (
                                <div className="space-y-6">
                                  <div className="bg-white p-4 rounded-lg text-center">
                                    <h3 className="text-black font-medium mb-2">
                                      Escaneie o QR Code PIX
                                    </h3>
                                    <div className="flex justify-center mb-4">
                                      <img
                                        src={pixQrCode}
                                        alt="QR Code PIX"
                                        className="w-48 h-48"
                                      />
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded mb-2">
                                      <p className="text-xs text-gray-600 mb-1">
                                        Código PIX copia e cola:
                                      </p>
                                      <div className="flex">
                                        <input
                                          type="text"
                                          value={pixCode}
                                          readOnly
                                          className="text-xs text-gray-800 bg-transparent flex-grow outline-none"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          className="h-6 w-6 p-0"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              pixCode,
                                            );
                                            toast({
                                              title: "Código copiado!",
                                              description:
                                                "O código PIX foi copiado para a área de transferência.",
                                            });
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <rect
                                              x="9"
                                              y="9"
                                              width="13"
                                              height="13"
                                              rx="2"
                                              ry="2"
                                            ></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                          </svg>
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Após o pagamento, pode levar alguns
                                      instantes para confirmarmos o recebimento.
                                    </p>
                                  </div>

                                  <Button
                                    type="button"
                                    className="w-full bg-alphablue text-white font-medium py-4 rounded-lg h-auto hover:opacity-90 transition-opacity"
                                    onClick={() =>
                                      handleStatusCheck(
                                        orderNumber,
                                        paymentResponse?.paymentId,
                                      )
                                    }
                                    disabled={isCheckingStatus}
                                  >
                                    {isCheckingStatus ? (
                                      <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verificando pagamento...
                                      </>
                                    ) : (
                                      "Já realizei o pagamento PIX"
                                    )}
                                  </Button>
                                </div>
                              ) : paymentResponse &&
                                watch("paymentMethod") === "boleto" ? (
                                <div className="space-y-6">
                                  <div className="bg-white p-4 rounded-lg text-center">
                                    <h3 className="text-black font-medium mb-2">
                                      Boleto Bancário
                                    </h3>
                                    <div className="bg-gray-100 p-3 rounded mb-4">
                                      <p className="text-sm text-gray-800 mb-1 font-medium">
                                        Número do Boleto:
                                      </p>
                                      <p className="text-xs text-gray-600 break-all">
                                        {boletoNumber}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      className="w-full bg-gray-800 text-white font-medium py-2 rounded-lg h-auto hover:bg-gray-700 transition-colors mb-4"
                                      onClick={() =>
                                        window.open(boletoUrl, "_blank")
                                      }
                                    >
                                      Visualizar Boleto
                                    </Button>
                                    <div className="text-left space-y-2">
                                      <p className="text-sm text-gray-800 font-medium">
                                        Instruções:
                                      </p>
                                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                        <li>O boleto vence em 3 dias úteis</li>
                                        <li>
                                          Após o pagamento, a compensação pode
                                          levar até 3 dias úteis
                                        </li>
                                        <li>
                                          Você receberá um email quando o
                                          pagamento for confirmado
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <Button
                                    type="button"
                                    className="w-full bg-alphablue text-white font-medium py-4 rounded-lg h-auto hover:opacity-90 transition-opacity"
                                    onClick={() =>
                                      handleStatusCheck(
                                        orderNumber,
                                        paymentResponse?.paymentId,
                                      )
                                    }
                                    disabled={isCheckingStatus}
                                  >
                                    {isCheckingStatus ? (
                                      <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verificando pagamento...
                                      </>
                                    ) : (
                                      "Verificar status do pagamento"
                                    )}
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                      clearCart();
                                      navigate("/");
                                    }}
                                  >
                                    Voltar para a loja
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  type="submit"
                                  className="bg-gradient-tech text-white font-medium py-6 rounded-lg h-auto hover:opacity-90 transition-opacity"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                      Processando pagamento...
                                    </>
                                  ) : (
                                    `Finalizar Pedido (${formatPrice(getCartTotal())})`
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </Form>
                </div>
              </div>

              <div>
                <div className="bg-alphadarkblue rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl text-white font-medium mb-4 flex items-center">
                    <CheckIcon className="text-alphagreen mr-2 h-5 w-5" />
                    Resumo do Pedido
                  </h2>

                  <div className="max-h-[300px] overflow-y-auto pr-2 mb-4">
                    {cartItems.map((item) => {
                      const discountedPrice = item.product.discount
                        ? Math.round(
                            item.product.price *
                              (1 - item.product.discount / 100),
                          )
                        : item.product.price;

                      return (
                        <div
                          key={item.product.id}
                          className="flex gap-3 mb-3 pb-3 border-b border-gray-700"
                        >
                          <div className="w-16 h-16">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://placehold.co/64x64/alphadark/gray?text=Imagem+Indisponível";
                              }}
                            />
                          </div>

                          <div className="flex-grow">
                            <h3 className="text-white text-sm">
                              {item.product.name}
                            </h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-400 text-xs">
                                Qtd: {item.quantity}
                              </span>
                              <span className="text-white text-sm">
                                {formatPrice(discountedPrice * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="bg-gray-700 mb-4" />

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Frete:</span>
                      <span className="text-alphablue">Grátis</span>
                    </div>
                  </div>

                  <Separator className="bg-gray-700 mb-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold text-xl">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-2">
                      Entrega Estimada:
                    </h3>
                    <p className="text-alphagreen">
                      {new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      * Estimativa para grandes centros urbanos
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-alphagreen/10 border border-alphagreen/30 rounded-lg">
                    <p className="text-alphagreen text-sm flex items-center">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Enviamos para todo o Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
