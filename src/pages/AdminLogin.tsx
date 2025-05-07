import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("loja.alphatechbr@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const demoPassword = "admin123"; // Troque para sua senha real
      if (email !== "loja.alphatechbr@gmail.com" || password !== demoPassword) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Email ou senha incorretos. Tente novamente.",
        });
        setIsLoading(false);
        return;
      }
      // Autenticação direta sem OTP
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          email,
          timestamp: Date.now(),
          expiresAt: Date.now() + 3600000,
        }),
      );
      toast({
        title: "Autenticado com sucesso",
        description: "Bem-vindo ao painel administrativo.",
      });
      navigate('/admin');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao autenticar. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-alphadarkblue p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Acesso Administrativo</h1>
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
                required
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
                autoComplete="current-password"
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
                "Acessar"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
