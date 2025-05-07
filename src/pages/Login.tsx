import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Edit,
  Trash2,
  BarChart3,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  DollarSign,
} from "lucide-react";
import products, { Product } from "../data/products";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const adminEmail = "loja.alphatechbr@gmail.com";
      const adminPassword = "admin123"; // Troque para sua senha real

      if (data.email !== adminEmail || data.password !== adminPassword) {
        toast({
          title: "Acesso negado",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Set admin session in localStorage
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          email: data.email,
          timestamp: Date.now(),
          expiresAt: Date.now() + 3600000, // 1 hour
        }),
      );

      toast({
        title: "Login bem-sucedido",
        description: "Você será redirecionado para o painel administrativo",
      });

      // Redirect to admin page
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro durante o login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-alphadarkblue rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-alphablue/20 flex items-center justify-center">
                <Lock className="h-8 w-8 text-alphablue" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-6">
              Acesso Administrativo
            </h1>

            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-tech text-white font-medium py-6 rounded-lg h-auto hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
