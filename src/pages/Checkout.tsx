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
<<<<<<< HEAD
import {
  Loader2,
  LockIcon,
  CreditCard,
  CheckIcon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
=======
import { Loader2, LockIcon, CreditCard, CheckIcon, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "../hooks/use-mobile";
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f

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

type PaymentStatus = "pending" | "processing" | "approved" | "rejected";

interface PaymentDetails {
  qrCodeImage?: string;
  qrCodeText?: string;
  barcode?: string;
  boletoUrl?: string;
  expiresAt?: string;
}

interface PaymentInfo {
  id: string;
  status: PaymentStatus;
  method: string;
  details: PaymentDetails;
}

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(
    CheckoutStep.PersonalData,
  );
  const [orderNumber, setOrderNumber] = useState<string>(
    `ALF${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`,
  );

=======
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.PersonalData);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const isMobile = useIsMobile();
  
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
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

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
    
    // Generate a new order number each time the component mounts
    setOrderNumber(`ALF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
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
<<<<<<< HEAD

  // Adicionar função para processar pagamento via Vercel Function
=======
  
  // Verify payment status with the payment API
  const verifyPayment = async () => {
    setVerifyingPayment(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentId: orderNumber,
          paymentMethod: paymentMethod
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data.success && data.payment) {
        setPaymentInfo(data.payment);
        
        if (data.payment.status === "approved") {
          // Send confirmation email
          sendConfirmationEmail();
          
          // Clear cart and redirect to success page
          setTimeout(() => {
            clearCart();
            navigate("/checkout/success", { 
              state: { 
                orderNumber,
                paymentMethod,
                total: getCartTotal()
              } 
            });
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast({
        title: "Erro ao verificar pagamento",
        description: "Ocorreu um erro ao verificar o status do pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setVerifyingPayment(false);
    }
  };
  
  // Send confirmation email
  const sendConfirmationEmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          email: getValues("email"),
          name: getValues("name"),
          orderNumber: orderNumber,
          totalAmount: getCartTotal(),
          paymentMethod: getValues("paymentMethod"),
          items: cartItems.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.discount 
              ? Math.round(item.product.price * (1 - item.product.discount / 100))
              : item.product.price
          }))
        }
      });
      
      if (error) {
        console.error("Error sending confirmation email:", error);
      }
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }
  };
  
  // Process payment
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
  const processPayment = async (data: FormData) => {
    setIsSubmitting(true);
    try {
<<<<<<< HEAD
      // Monta o payload para a API
      const payload = {
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
        orderId: orderNumber,
        // Adicione outros campos necessários para o gateway
      };
      // Chama a função serverless
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao processar pagamento");

      // Trate o resultado conforme o método de pagamento
      if (data.paymentMethod === "pix") {
        // Exemplo: setar QR Code e código Pix
        setPixQrCode(result.pix?.qrCode || "");
        setPixCode(result.pix?.code || "");
      } else if (data.paymentMethod === "boleto") {
        setBoletoUrl(result.boleto?.url || "");
        setBoletoNumber(result.boleto?.number || "");
      } else if (data.paymentMethod === "credit") {
        // Exemplo: checar status do cartão
        if (result.card?.status === "approved") {
          toast({ title: "Pagamento aprovado!", description: "Seu pedido foi confirmado." });
          clearCart();
          navigate("/checkout/success", { state: { orderNumber, paymentMethod: data.paymentMethod } });
          return;
        } else {
          toast({ title: "Pagamento recusado", description: "Tente outro cartão ou método." });
        }
      }
      // Para Pix e boleto, segue para tela de confirmação/espera
      setCurrentStep(CheckoutStep.Confirmation);
=======
      // For credit card payments, we'll simulate an immediate response
      if (data.paymentMethod === "credit") {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Here we would normally make a call to the payment processor API
        // For demo purposes, we'll simulate a successful payment
        const isApproved = Math.random() > 0.2; // 80% chance of success
        
        if (isApproved) {
          // Send confirmation email
          await sendConfirmationEmail();
          
          toast({
            title: "Pagamento aprovado!",
            description: "Seu pedido foi confirmado com sucesso.",
          });
          
          // Clear the cart
          clearCart();
          
          // Redirect to success page
          navigate("/checkout/success", { 
            state: { 
              orderNumber,
              paymentMethod: data.paymentMethod,
              total: getCartTotal()
            } 
          });
        } else {
          toast({
            title: "Pagamento recusado",
            description: "Seu cartão foi recusado. Por favor, tente outro método de pagamento.",
            variant: "destructive",
          });
          setCurrentStep(CheckoutStep.Payment);
        }
      } else {
        // For Pix and Boleto, verify the payment status
        await verifyPayment();
      }
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Erro no processamento do pagamento",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // No onSubmit, chame processPayment em vez do mock antigo
  const onSubmit = (data: FormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description:
          "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    // Process the payment
    processPayment(data);
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
                      onSubmit={form.handleSubmit(onSubmit)}
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
<<<<<<< HEAD
                                  <Input
                                    placeholder="(11) 99999-9999"
                                    {...field}
                                  />
=======
                                  <Input placeholder="(13) 99611-4479" {...field} />
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
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
                            {paymentInfo && paymentInfo.method === "pix" && paymentInfo.details.qrCodeImage && (
                              <div className="bg-alphadark rounded-lg p-4">
                                <h3 className="text-white font-medium mb-3 text-center">Pagamento via PIX</h3>
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={paymentInfo.details.qrCodeImage} 
                                    alt="QR Code PIX" 
                                    className="w-48 h-48 mb-4"
                                  />
                                  <div className="bg-gray-800 p-3 rounded mb-4 w-full overflow-hidden">
                                    <p className="text-gray-300 text-sm mb-1">Código PIX copia e cola:</p>
                                    <p className="text-white text-xs font-mono break-all">{paymentInfo.details.qrCodeText}</p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mb-4"
                                    onClick={() => {
                                      navigator.clipboard.writeText(paymentInfo.details.qrCodeText || "");
                                      toast({
                                        title: "Código copiado!",
                                        description: "Cole o código no aplicativo do seu banco.",
                                      });
                                    }}
                                  >
                                    Copiar código
                                  </Button>
                                  <div className="flex items-center text-sm text-yellow-500">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    <p>Este QR Code expira em 30 minutos</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {paymentInfo && paymentInfo.method === "boleto" && paymentInfo.details.barcode && (
                              <div className="bg-alphadark rounded-lg p-4">
                                <h3 className="text-white font-medium mb-3 text-center">Pagamento via Boleto</h3>
                                <div className="flex flex-col items-center">
                                  <div className="bg-gray-800 p-3 rounded mb-4 w-full">
                                    <p className="text-gray-300 text-sm mb-1">Código de barras:</p>
                                    <p className="text-white text-xs font-mono break-all">{paymentInfo.details.barcode}</p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mb-4"
                                    onClick={() => {
                                      navigator.clipboard.writeText(paymentInfo.details.barcode || "");
                                      toast({
                                        title: "Código copiado!",
                                        description: "Cole o código no aplicativo do seu banco.",
                                      });
                                    }}
                                  >
                                    Copiar código de barras
                                  </Button>
                                  <Button
                                    type="button"
                                    className="w-full bg-alphablue hover:bg-alphablue/80 mb-4"
                                    onClick={() => {
                                      window.open(paymentInfo.details.boletoUrl, '_blank');
                                    }}
                                  >
                                    Abrir boleto para impressão
                                  </Button>
                                  <div className="flex items-center text-sm text-yellow-500">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    <p>O boleto vence em 3 dias úteis</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
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
                                disabled={isSubmitting || verifyingPayment}
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar: Pagamento
                              </Button>
<<<<<<< HEAD

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
                                    onClick={checkPaymentStatus}
                                    disabled={checkingPaymentStatus}
                                  >
                                    {checkingPaymentStatus ? (
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
                                    onClick={checkPaymentStatus}
                                    disabled={checkingPaymentStatus}
                                  >
                                    {checkingPaymentStatus ? (
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
=======
                              
                              {paymentInfo && (paymentMethod === "pix" || paymentMethod === "boleto") ? (
                                <Button
                                  type="button"
                                  className="bg-green-600 text-white font-medium py-3 px-6 rounded-lg h-auto hover:bg-green-700 transition-colors"
                                  disabled={verifyingPayment}
                                  onClick={verifyPayment}
                                >
                                  {verifyingPayment ? (
                                    <>
                                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                      Verificando pagamento...
                                    </>
                                  ) : (
                                    "Verificar pagamento"
                                  )}
                                </Button>
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
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

                  {/* WhatsApp button */}
                  <div className="mt-4">
                    <a 
                      href={`https://wa.me/5513996114479?text=Olá! Gostaria de finalizar minha compra pelo WhatsApp para ganhar 15% de desconto. Pedido: ${orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current">
                        <path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1 .09-.362c.124-.124.267-.143.466-.143.954 0 .54.208.712.372.45.43.683.873.876 1.117.212.202.62.634. 223a.22.22 0 0 0 .313-.287c.142-.226.454-1.086.584-1.593. 13-.11.212-.325.232-.52.02-.208-.117-.312-.244-.397.127-.127.574-.6. 574-1.28a1.13 1.13 0 0 0-.373-.8 1.525 1.525 0 0 0-1.069-.402c-.215 0-.421.021-.595.098-.454.210-.575.684-.576.8-.032.1. 81a4. 14 4.14 0 0 1-1.19 2.962c-.312.312-.494.587-.57.622. 776-.158 1.321-.51 1.72-.884.52-.514 1.055-1.167 1.586-1.7. 586-1.194.922-1.015 1.276-.15.22.21. 423a.53.53 0 0 0-.486.405.48.48 0 0 0 .149.390c.196.22.46.41. 73.58a.578.578 0 0 0-.168.393c0 .241.123.362.44.382.152.010.297-.013.427-.06l.111.11c.264.18.5.6.5 1.06a.488.488 0 0 1-.192.392c-.2.2-.5.16-.76.16a.5.5 0 0 1-.212-.049c-.13-.04-.295-.12-.348-.14-1.134-.173-2.432-.809-2.813-1.033a10.477 10.477 0 0 1-1.828 1.137c-.389.24-.68.36-.744.36-.5.033-.124.164-.163.312-.153.565-.389.752a3.5a.25 0 0 1 .243.088.33.33 0 0 1 0 .392c-.117.210-.03.431.046.614.24.571.366 1.025.442 1.373a.3.3 0 0 1-.283.363zM16 30a14 14 0 0 1-7.223-1.998c-.52-.202-.952-.398-1.326-.63-.75-.365-1.505-.94-1.163-1.69.056-.119.328-.414.625-.621 3.948-2.577 6.194-5.885 6.55-9.648a.324.324 0 0 0-.156-.284.3.3 0 0 0-.322.052c-.126.126-.167.367-.167.57 0 1.657-1.682 1.907-2.5 1.695-.92-.198-1.116-.414-1.214-.55-.094-.13-.052-.26-.086-.425-.062-.292-.156-.465-.499-.465-.59 0-1.417.82-1.417 1.977a2.46 2.46 0 0 0 .59 1.587c.384.384 1.053.885 2.102.885.24 0 .463-.053.667-.16.477-.135.814-.372.748-.63-.35-.13-.21-.288-.592-.288-.124 0-.249.042-.397.066a.732.732 0 0 1-.176.02.399.399 0 0 1-.264-.095c-.176-.16-.173-.386.122-.532.468-.227 1.11-.228 1.585 0 .473.228.87.845.283 1.264.567.405 1.41.701 2.407.701 1.005 0 1.855-.303 2.427-.716.158-.433.556-1.066 1.028-1.295.474-.239 1.116-.223 1.582.016.15.078.226.272.124.426-.103.123-.25.19-.416.147-.107-.034-.21-.064-.334-.064-.381 0-.558.202-.563.304-.064.258.303.483.777.618.206.108.43.16.67.16 1.048 0 1.717-.5 2.102-.885a2.49 2.49 0 0 0 .587-1.587c0-1.154-.825-1.977-1.416-1.977-.342 0-.443.173-.455.465-1.04.212-.29.301-.16.431-.98.136-.293.352-1.215.55a1.88 1.88 0 0 1-.365.035c-.883 0-1.932-.462-1.932-1.73 0-.203-.041-.444-.167-.57a.304.304 0 0 0-.322-.052.324.324 0 0 0-.156.284c.356 3.763 2.602 7.07 6.55 9.648.295.197.568.502.624.62.342.76-.413 1.325-1.163 1.69-.374.232-.805.428-1.326.63A14 14 0 0 1 16 30z"/>
                      </svg>
                      Comprar pelo WhatsApp (15% OFF)
                    </a>
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
