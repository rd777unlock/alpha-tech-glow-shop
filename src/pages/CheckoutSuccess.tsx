import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Package } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Get order information from location state or generate random
  useEffect(() => {
    if (location.state?.orderNumber) {
      setOrderNumber(location.state.orderNumber);
    } else {
      setOrderNumber(
        `ALF${Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0")}`,
      );
    }

    if (location.state?.paymentMethod) {
      setPaymentMethod(location.state.paymentMethod);
    }
  }, [location]);

  // Estimate delivery date (10 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 10);

  const formattedDeliveryDate = deliveryDate.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Ensure cart is cleared when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-alphadarkblue rounded-2xl p-6 md:p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-alphagreen/20 flex items-center justify-center">
                <CheckCircle size={60} className="text-alphagreen" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pedido Confirmado!
            </h1>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Obrigado pela sua compra. Seu pedido foi processado com sucesso e
              em breve enviaremos um email com os detalhes.
            </p>

            <div className="bg-alphadark/40 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">
                    Número do Pedido
                  </h3>
                  <p className="text-white font-medium">{orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">Status</h3>
                  <p className="text-alphagreen font-medium">Processando</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-1">
                    Entrega Estimada
                  </h3>
                  <p className="text-white font-medium">
                    {formattedDeliveryDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl text-white font-medium mb-6">
                Próximos Passos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-alphadark/40 rounded-xl p-5">
                  <div className="h-12 w-12 rounded-full bg-alphablue/20 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="text-alphablue h-6 w-6" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Processamento</h3>
                  <p className="text-gray-400 text-sm">
                    Seu pedido está sendo processado e será preparado para
                    envio.
                  </p>
                </div>

                <div className="bg-alphadark/40 rounded-xl p-5">
                  <div className="h-12 w-12 rounded-full bg-alphablue/20 flex items-center justify-center mx-auto mb-4">
                    <Package className="text-alphablue h-6 w-6" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Envio</h3>
                  <p className="text-gray-400 text-sm">
                    Você receberá um email com o código de rastreamento quando
                    seu pedido for despachado.
                  </p>
                </div>

                <div className="bg-alphadark/40 rounded-xl p-5">
                  <div className="h-12 w-12 rounded-full bg-alphablue/20 flex items-center justify-center mx-auto mb-4">
                    <Home className="text-alphablue h-6 w-6" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Entrega</h3>
                  <p className="text-gray-400 text-sm">
                    Seu pedido será entregue no endereço informado no prazo
                    estimado.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-tech text-white font-medium"
                asChild
              >
                <Link to="/">Voltar para a Home</Link>
              </Button>

              <Button variant="outline" className="text-white" asChild>
                <Link to="/produtos">Continuar Comprando</Link>
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
