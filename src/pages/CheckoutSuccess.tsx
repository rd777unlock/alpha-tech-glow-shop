
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Clock, Truck } from "lucide-react";

type LocationState = {
  orderNumber: string;
  paymentMethod: string;
  total: number;
} | null;

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If no orderNumber in state, redirect to home
    if (!state || !state.orderNumber) {
      navigate('/');
    }
  }, [navigate, state]);
  
  if (!state || !state.orderNumber) {
    return null;
  }
  
  const { orderNumber, paymentMethod, total } = state;
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'credit':
        return 'Cartão de Crédito';
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return method;
    }
  };
  
  const getTips = (method: string) => {
    switch (method) {
      case 'credit':
        return [
          'Seu pagamento foi aprovado com sucesso',
          'Você receberá um e-mail de confirmação',
          'Acompanhe o status do seu pedido pelo e-mail'
        ];
      case 'pix':
        return [
          'Seu pedido será confirmado após o pagamento do PIX',
          'Você receberá um e-mail de confirmação após o pagamento',
          'O QR Code tem validade de 30 minutos'
        ];
      case 'boleto':
        return [
          'Seu pedido será confirmado após o pagamento do boleto',
          'O boleto tem vencimento em 3 dias úteis',
          'Você receberá um e-mail de confirmação após o pagamento'
        ];
      default:
        return [
          'Seu pedido foi processado com sucesso',
          'Você receberá um e-mail de confirmação',
          'Acompanhe o status do seu pedido pelo e-mail'
        ];
    }
  };
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-alphadarkblue rounded-xl p-6 md:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Pedido Realizado com Sucesso!</h1>
              
              {paymentMethod === 'credit' ? (
                <p className="text-gray-300">
                  Seu pagamento foi aprovado e seu pedido será processado em breve.
                </p>
              ) : (
                <p className="text-gray-300">
                  Seu pedido foi registrado e será processado após a confirmação do pagamento.
                </p>
              )}
            </div>
            
            <div className="bg-alphadark rounded-lg p-5 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Número do Pedido</p>
                  <p className="text-white font-bold">{orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Valor Total</p>
                  <p className="text-white font-bold">{formatPrice(total)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Forma de Pagamento</p>
                  <p className="text-white">{getPaymentMethodDisplay(paymentMethod)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Data</p>
                  <p className="text-white">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="bg-alphadark rounded-lg p-5 flex items-start">
                <ShoppingBag className="text-alphablue h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">Informações Importantes</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {getTips(paymentMethod).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-alphablue mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-alphadark rounded-lg p-5 flex items-start">
                <Clock className="text-alphablue h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">Prazos</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="text-alphablue mr-2">•</span>
                      <span>Processamento do pedido: até 2 dias úteis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-alphablue mr-2">•</span>
                      <span>Envio: de 5 a 15 dias úteis, dependendo da região</span>
                    </li>
                    {paymentMethod === 'boleto' && (
                      <li className="flex items-start">
                        <span className="text-alphablue mr-2">•</span>
                        <span>Compensação do boleto: até 3 dias úteis</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="bg-alphadark rounded-lg p-5 flex items-start">
                <Truck className="text-alphablue h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">Entrega</h3>
                  <p className="text-gray-300 text-sm">
                    Você receberá atualizações sobre o envio por e-mail. Em caso de dúvidas, entre em contato pelo WhatsApp: <strong>13 99611-4479</strong> ou e-mail: <strong>loja.alphatechbr@gmail.com</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                className="bg-gradient-tech text-white font-medium py-3 h-auto md:px-8 hover:opacity-90 transition-opacity"
              >
                Continuar Comprando
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  window.open(`https://wa.me/5513996114479?text=Olá! Gostaria de acompanhar meu pedido ${orderNumber} realizado hoje.`, '_blank');
                }}
                className="text-white border-white/30 hover:bg-white/10 py-3 h-auto md:px-8"
              >
                Acompanhar pelo WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
