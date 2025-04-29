
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("loja.alphatechbr@gmail.com");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll use a hardcoded password
      // In production, you would use proper authentication with Supabase
      const demoPassword = "admin123"; // You should change this in production

      if (password !== demoPassword) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Senha incorreta. Tente novamente.",
        });
        setIsLoading(false);
        return;
      }

      // Send OTP email
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      toast({
        title: "Código enviado",
        description: "Um código de verificação foi enviado para seu email.",
      });
      
      setShowOtpInput(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao enviar o código. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // In a real application, you would validate if this user is an admin
      // Store admin session in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminEmail', email);
      
      toast({
        title: "Autenticado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "O código informado é inválido ou expirou.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-alphadarkblue p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Acesso Administrativo</h1>
          
          {!showOtpInput ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-tech hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Enviar código de verificação"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                  Código de verificação
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full"
                  required
                  placeholder="Digite o código recebido por email"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Digite o código de verificação enviado para {email}
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-tech hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar e acessar"
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => setShowOtpInput(false)}
                disabled={isLoading}
              >
                Voltar
              </Button>
            </form>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
