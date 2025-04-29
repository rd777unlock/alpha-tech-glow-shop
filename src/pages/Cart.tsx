
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Get random products for suggestions
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setSuggestedProducts(shuffled.slice(0, 4));
    }
  }, []);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
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
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-white font-medium">Itens no Carrinho</h2>
                    <Button 
                      variant="outline" 
                      className="text-red-400 hover:text-red-300"
                      onClick={clearCart}
                    >
                      Limpar Carrinho
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => {
                      const discountedPrice = item.product.discount 
                        ? Math.round(item.product.price * (1 - item.product.discount / 100)) 
                        : item.product.price;
                        
                      return (
                        <div key={item.product.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-700">
                          <div className="w-full sm:w-24 h-24">
                            <Link to={`/product/${item.product.id}`}>
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://placehold.co/96x96/alphadark/gray?text=Imagem+Indisponível";
                                }}
                              />
                            </Link>
                          </div>
                          
                          <div className="flex-grow">
                            <Link to={`/product/${item.product.id}`} className="text-white hover:text-alphablue font-medium block">
                              {item.product.name}
                            </Link>
                            <span className="text-gray-400 text-sm">{item.product.category}</span>
                            
                            <div className="flex justify-between items-end mt-2">
                              <div className="flex items-center gap-3 mt-2">
                                <Button 
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-md"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-white w-6 text-center">{item.quantity}</span>
                                <Button 
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-md"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="flex items-end gap-4">
                                <div className="text-right">
                                  <div className="text-white font-medium">
                                    {formatPrice(discountedPrice * item.quantity)}
                                  </div>
                                  {item.product.discount && (
                                    <div className="text-gray-400 text-sm line-through">
                                      {formatPrice(item.product.price * item.quantity)}
                                    </div>
                                  )}
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-gray-400 hover:text-red-400"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-alphadarkblue rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl text-white font-medium mb-4">Resumo do Pedido</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Frete:</span>
                      <span className="text-alphablue">Grátis</span>
                    </div>
                    <Separator className="bg-gray-700 my-3" />
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-white font-bold text-xl">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-tech text-white font-medium py-6 rounded-lg h-auto hover:opacity-90 transition-opacity flex items-center justify-center"
                      onClick={handleCheckout}
                    >
                      Finalizar Compra
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/produtos')}
                    >
                      Continuar Comprando
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-white font-medium mb-3">Métodos de Pagamento</h3>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
                        <img 
                          src="https://logospng.org/download/visa/logo-visa-2048.png" 
                          alt="Visa" 
                          className="h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/24x24/alphadark/gray?text=VISA";
                          }}
                        />
                      </div>
                      <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
                        <img 
                          src="https://logospng.org/download/mastercard/logo-mastercard-2048.png" 
                          alt="Mastercard" 
                          className="h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/24x24/alphadark/gray?text=MC";
                          }}
                        />
                      </div>
                      <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
                        <img 
                          src="https://logospng.org/download/pix/logo-pix-512.png" 
                          alt="Pix" 
                          className="h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/24x24/alphadark/gray?text=PIX";
                          }}
                        />
                      </div>
                      <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
                        <img 
                          src="https://logospng.org/download/boleto-bancario/logo-boleto-bancario-256.png" 
                          alt="Boleto" 
                          className="h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/24x24/alphadark/gray?text=BOLETO";
                          }}
                        />
                      </div>
                      <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
                        <img 
                          src="https://logodownload.org/wp-content/uploads/2020/02/american-express-logo-0-1536x1536.png" 
                          alt="American Express" 
                          className="h-6"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/24x24/alphadark/gray?text=AMEX";
                          }}
                        />
                      </div>
                    </div>
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
                to="/produtos"
                className="bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity inline-block"
              >
                Explorar Produtos
              </Link>
            </div>
          )}
          
          {/* Product suggestions */}
          {suggestedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl text-white font-bold mb-8">Você pode gostar também</h2>
              <ProductGrid products={suggestedProducts} showFilter={false} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
