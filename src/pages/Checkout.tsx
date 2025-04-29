
import { useState } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "../hooks/use-toast";
import { Loader2, LockIcon, CreditCard, CheckIcon, AlertTriangle } from "lucide-react";

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

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const { watch } = form;
  const paymentMethod = watch("paymentMethod");
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  // Simulate payment processing
  const processPayment = async (data: FormData) => {
    setIsSubmitting(true);
    
    // In a real application, you would call your payment API here
    // For this demo, we'll simulate a successful payment after a short delay
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        description: "Por favor, tente novamente ou use outro método de pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmit = (data: FormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
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
              <span className="text-white">Checkout seguro - Seus dados estão protegidos</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-alphadarkblue rounded-xl p-6 mb-6">
                  <h2 className="text-xl text-white font-medium mb-6">Informações de Entrega</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
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
                                <Input type="email" placeholder="seu@email.com" {...field} />
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
                              <Input placeholder="(11) 99999-9999" {...field} />
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
                              <Input placeholder="Rua, número, complemento" {...field} />
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
                                  <Input placeholder="Sua cidade" {...field} />
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
                      
                      <Separator className="bg-gray-700 my-6" />
                      
                      <div>
                        <h2 className="text-xl text-white font-medium mb-6">Método de Pagamento</h2>
                        
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
                                  <div className={`border ${field.value === 'credit' ? 'border-alphablue' : 'border-gray-600'} rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="credit" id="credit" />
                                      <FormLabel htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Cartão de Crédito</span>
                                      </FormLabel>
                                    </div>
                                    
                                    {field.value === 'credit' && (
                                      <div className="mt-4 space-y-4">
                                        <FormField
                                          control={form.control}
                                          name="cardNumber"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Número do Cartão</FormLabel>
                                              <FormControl>
                                                <Input placeholder="0000 0000 0000 0000" {...field} />
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
                                              <FormLabel>Nome no Cartão</FormLabel>
                                              <FormControl>
                                                <Input placeholder="Como está no cartão" {...field} />
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
                                                <FormLabel>Validade</FormLabel>
                                                <FormControl>
                                                  <Input placeholder="MM/AA" {...field} />
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
                                                  <Input placeholder="123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className={`border ${field.value === 'pix' ? 'border-alphablue' : 'border-gray-600'} rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="pix" id="pix" />
                                      <FormLabel htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                                        <img src="https://logospng.org/download/pix/logo-pix-512.png" alt="Pix" className="h-5 w-5" />
                                        <span>Pix</span>
                                      </FormLabel>
                                    </div>
                                    
                                    {field.value === 'pix' && (
                                      <div className="mt-4 p-4 bg-gray-800 rounded-lg text-center">
                                        <p className="text-gray-300 mb-2">Finalize a compra para gerar o código Pix</p>
                                        <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-2" />
                                        <p className="text-gray-300 text-sm">O código Pix será gerado na próxima etapa</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className={`border ${field.value === 'boleto' ? 'border-alphablue' : 'border-gray-600'} rounded-lg p-4 transition-colors`}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="boleto" id="boleto" />
                                      <FormLabel htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
                                        <img src="https://logospng.org/download/boleto-bancario/logo-boleto-bancario-256.png" alt="Boleto" className="h-5 w-5" />
                                        <span>Boleto Bancário</span>
                                      </FormLabel>
                                    </div>
                                    
                                    {field.value === 'boleto' && (
                                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                                        <p className="text-gray-300 mb-2">Informações importantes:</p>
                                        <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
                                          <li>O boleto será gerado na próxima etapa</li>
                                          <li>Prazo de até 3 dias úteis para compensação</li>
                                          <li>Produtos liberados após confirmação do pagamento</li>
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
                      </div>
                      
                      <div className="pt-6">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-tech text-white font-medium py-6 rounded-lg h-auto hover:opacity-90 transition-opacity"
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
                        
                        <p className="text-gray-400 text-sm text-center mt-4 flex items-center justify-center">
                          <LockIcon className="h-4 w-4 mr-1" />
                          Pagamento seguro processado com criptografia
                        </p>
                      </div>
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
                        ? Math.round(item.product.price * (1 - item.product.discount / 100)) 
                        : item.product.price;
                        
                      return (
                        <div key={item.product.id} className="flex gap-3 mb-3 pb-3 border-b border-gray-700">
                          <div className="w-16 h-16">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <h3 className="text-white text-sm">{item.product.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-gray-400 text-xs">Qtd: {item.quantity}</span>
                              <span className="text-white text-sm">{formatPrice(discountedPrice * item.quantity)}</span>
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
                      <span className="text-white">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Frete:</span>
                      <span className="text-alphablue">Grátis</span>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700 mb-4" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold text-xl">{formatPrice(getCartTotal())}</span>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-2">Entrega Estimada:</h3>
                    <p className="text-alphagreen">
                      {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { 
                        day: 'numeric', 
                        month: 'long'
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
