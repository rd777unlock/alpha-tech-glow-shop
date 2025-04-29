
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "../hooks/use-toast";

// This is a simple cart implementation. In a real app, you would use a state management solution
// like React Context, Redux, Zustand, etc.

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    // In a real app, you would get this data from local storage, context, or an API
    // For now, we'll show an empty cart
    setCartItems([]);
    setTotal(0);
  }, []);
  
  const removeFromCart = (itemId: string) => {
    // This would remove the item from cart in a real implementation
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho com sucesso.",
    });
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <ShoppingCart className="text-alphablue" />
            Seu Carrinho
          </h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-alphadarkblue rounded-xl p-6">
                  <h2 className="text-xl text-white font-medium mb-4">Itens no Carrinho</h2>
                  
                  <div className="space-y-4">
                    {/* This would map through cart items in a real implementation */}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-alphadarkblue rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl text-white font-medium mb-4">Resumo do Pedido</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Frete:</span>
                      <span className="text-alphablue">Grátis</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3 flex justify-between">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-white font-bold">{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      className="w-full bg-gradient-tech text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                      onClick={() => {
                        toast({
                          title: "Pedido enviado",
                          description: "Seu pedido foi enviado para processamento.",
                        });
                      }}
                    >
                      Finalizar Compra
                    </button>
                    
                    <a 
                      href={`https://wa.me/5511xxxxxxxxx?text=Olá! Gostaria de finalizar minha compra dos seguintes itens: ${cartItems.map(item => item.name).join(', ')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-white text-alphadark font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                      Finalizar via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-alphadarkblue rounded-xl p-10 text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <ShoppingCart size={60} className="text-gray-400" />
              </div>
              <h2 className="text-2xl text-white font-medium mb-3">Seu carrinho está vazio</h2>
              <p className="text-gray-300 mb-6">
                Você ainda não adicionou nenhum produto ao carrinho. Explore nossos produtos e encontre o que você precisa!
              </p>
              <Link 
                to="/"
                className="bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity inline-block"
              >
                Explorar Produtos
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
