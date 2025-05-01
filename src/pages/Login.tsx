import { useState } from "react";
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

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "O código OTP deve ter 6 dígitos"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Check if the email is the admin email
      const adminEmail = "loja.alphatechbr@gmail.com";

      if (data.email !== adminEmail) {
        toast({
          title: "Acesso negado",
          description: "Email não autorizado para acesso administrativo",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify password (in a real app, this would be done securely on the backend)
      // For demo purposes, we're using a simple check
      if (data.password !== "admin123") {
        toast({
          title: "Senha incorreta",
          description: "A senha fornecida está incorreta",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setEmail(data.email);
      setShowOtpForm(true);
      toast({
        title: "Código enviado",
        description: "Um código de verificação foi enviado para seu email",
      });
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

  const onOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      // Verify OTP
      const isValidOtp = data.otp === "123456"; // For demo purposes, we're using a simple check

      if (!isValidOtp) {
        throw new Error("Código OTP inválido ou expirado");
      }

      // Set admin session in localStorage
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          email,
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
      console.error("OTP verification error:", error);
      toast({
        title: "Erro na verificação",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro durante a verificação",
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
              {showOtpForm
                ? "Verificação em duas etapas"
                : "Acesso Administrativo"}
            </h1>

            {!showOtpForm ? (
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
            ) : (
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="space-y-4"
                >
                  <p className="text-gray-300 text-center mb-4">
                    Digite o código de verificação enviado para {email}
                  </p>

                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código OTP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456"
                            {...field}
                            maxLength={6}
                            className="text-center text-xl tracking-widest"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-tech text-white font-medium py-6 rounded-lg h-auto hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOtpForm(false)}
                      disabled={isLoading}
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
