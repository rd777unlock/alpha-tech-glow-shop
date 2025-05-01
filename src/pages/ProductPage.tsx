import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "../context/CartContext";
import products from "../data/products";
import { Loader2, ShoppingCart, CheckCircle, ChevronRight, Star, AlertCircle } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Find the product by ID
  const product = products.find(p => p.id === id);
  
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [goingToCheckout, setGoingToCheckout] = useState(false);
  
  // Corrigido: lógica para verificar se o produto está no carrinho
  const isProductInCart = product ? cartItems.some(item => item.product.id === product.id) : false;
  const cartQuantity = product ? (cartItems.find(item => item.product.id === product.id)?.quantity || 0) : 0;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Reset quantity if changing products
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-alphadark flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Produto não encontrado</h1>
            <Button 
              onClick={() => navigate("/")}
              className="bg-alphablue hover:bg-alphablue/80"
            >
              Voltar para a Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const discountedPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      if (isProductInCart) {
        updateQuantity(product.id, cartQuantity + quantity);
      } else {
        addToCart(product);
      }
      
      toast({
        title: "Produto adicionado ao carrinho",
        description: `${quantity}x ${product.name} ${isProductInCart ? '(atualizado)' : 'adicionado'} ao carrinho.`,
      });
      
      setAddingToCart(false);
    }, 500);
  };
  
  const handleBuyNow = () => {
    if (!product) return;
    
    setGoingToCheckout(true);
    
    // Add to cart and redirect to checkout
    setTimeout(() => {
      if (isProductInCart) {
        updateQuantity(product.id, cartQuantity + quantity);
      } else {
        addToCart(product);
      }
      
      navigate("/checkout");
    }, 500);
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image */}
            <div className="w-full lg:w-1/2">
              <div className="bg-alphadarkblue rounded-xl p-4">
                <div className="relative pb-[100%] overflow-hidden rounded-lg mb-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/600x600/alphadark/gray?text=Imagem+Indisponível";
                    }}
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="w-full lg:w-1/2">
              <div className="bg-alphadarkblue rounded-xl p-6">
                <div>
                  <div className="flex items-center gap-2 text-alphablue mb-2">
                    <span className="px-2 py-0.5 bg-alphablue/10 rounded text-sm font-medium">{product.category}</span>
                    {product.inStock ? (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-sm font-medium flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Em estoque
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-sm font-medium flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Fora de estoque
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{product.name}</h1>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">(128 avaliações)</span>
                  </div>
                  
                  <div className="flex items-end gap-3 mb-6">
                    {product.discount ? (
                      <>
                        <span className="text-3xl font-bold text-white">{formatPrice(discountedPrice)}</span>
                        <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6 mb-6">
                    <p className={`text-gray-300 mb-6 ${isMobile ? 'text-sm' : ''}`}>
                      {product.description || "Sem descrição disponível para este produto."}
                    </p>
                    
                    {product.features && product.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">Características</h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-alphablue flex-shrink-0 mt-0.5" />
                              <span className={`text-gray-300 ${isMobile ? 'text-sm' : ''}`}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-400 mb-2">
                        Quantidade
                      </label>
                      <div className="flex items-center w-full max-w-[160px]">
                        <button
                          type="button"
                          className="bg-alphadark h-10 w-10 rounded-l flex items-center justify-center text-white hover:bg-alphablue/20 transition-colors"
                          onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setQuantity(value > 0 ? value : 1);
                          }}
                          min="1"
                          className="h-10 w-full text-center bg-alphadark border-x border-gray-700 text-white"
                        />
                        <button
                          type="button"
                          className="bg-alphadark h-10 w-10 rounded-r flex items-center justify-center text-white hover:bg-alphablue/20 transition-colors"
                          onClick={() => setQuantity(prev => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
                      <Button
                        onClick={handleAddToCart}
                        disabled={addingToCart || !product.inStock}
                        className="bg-alphadarkblue border border-alphablue text-white hover:bg-alphablue/20 transition-colors h-12"
                      >
                        {addingToCart ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adicionando...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {isProductInCart ? "Atualizar carrinho" : "Adicionar ao carrinho"}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={handleBuyNow}
                        disabled={goingToCheckout || !product.inStock}
                        className="bg-gradient-tech text-white hover:opacity-90 transition-opacity h-12"
                      >
                        {goingToCheckout ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Comprar agora"
                        )}
                      </Button>
                      
                      <a 
                        href={`https://wa.me/5513996114479?text=Olá! Tenho interesse no produto: ${product.name}. Gostaria de mais informações e aproveitar o desconto de 15% para compras via WhatsApp.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md h-12 transition-colors ${isMobile ? 'w-full' : ''}`}
                      >
                        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current">
                          <path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1 .09-.362c.124-.124.267-.143.466-.143.954 0 .54.208.712.372.45.43.683.873.876 1.117.212.202.62.634. 223a.22.22 0 0 0 .313-.287c.142-.226.454-1.086.584-1.593. 13-.11.212-.325.232-.52.02-.208-.117-.312-.244-.397.127-.127.574-.6. 574-1.28a1.13 1.13 0 0 0-.373-.8 1.525 1.525 0 0 0-1.069-.402c-.215 0-.421.021-.595.098-.454.210-.575.684-.576.8-.032.1. 81a4. 14 4.14 0 0 1-1.19 2.962c-.312.312-.494.587-.57.622. 776-.158 1.321-.51 1.72-.884.52-.514 1.055-1.167 1.586-1.7. 586-1.194.922-1.015 1.276-.15.22.21. 423a.53.53 0 0 0-.486.405.48.48 0 0 0 .149.390c.196.22.46.41. 73.58a.578.578 0 0 0-.168.393c0 .241.123.362.44.382.152.010.297-.013.427-.06l.111.11c.264.18.5.6.5 1.06a.488.488 0 0 1-.192.392c-.2.2-.5.16-.76.16a.5.5 0 0 1-.212-.049c-.13-.04-.295-.12-.348-.14-1.134-.173-2.432-.809-2.813-1.033a10.477 10.477 0 0 1-1.828 1.137c-.389.24-.68.36-.744.36-.5.033-.124.164-.163.312-.153.565-.389.752a3.5a.25 0 0 1 .243.088.33.33 0 0 1 0 .392c-.117.210-.03.431.046.614.24.571.366 1.025.442 1.373a.3.3 0 0 1-.283.363zM16 30a14 14 0 0 1-7.223-1.998c-.52-.202-.952-.398-1.326-.63-.75-.365-1.505-.94-1.163-1.69.056-.119.328-.414.625-.621 3.948-2.577 6.194-5.885 6.55-9.648a.324.324 0 0 0-.156-.284.3.3 0 0 0-.322.052c-.126.126-.167.367-.167.57 0 1.657-1.682 1.907-2.5 1.695-.92-.198-1.116-.414-1.214-.55-.094-.13-.052-.26-.086-.425-.062-.292-.156-.465-.499-.465-.59 0-1.417.82-1.417 1.977a2.46 2.46 0 0 0 .59 1.587c.384.384 1.053.885 2.102.885.24 0 .463-.053.667-.16.477-.135.814-.372.748-.63-.35-.13-.21-.288-.592-.288-.124 0-.249.042-.397.066a.732.732 0 0 1-.176.02.399.399 0 0 1-.264-.095c-.176-.16-.173-.386.122-.532.468-.227 1.11-.228 1.585 0 .473.228.87.845.283 1.264.567.405 1.41.701 2.407.701 1.005 0 1.855-.303 2.427-.716.158-.433.556-1.066 1.028-1.295.474-.239 1.116-.223 1.582.016.15.078.226.272.124.426-.103.123-.25.19-.416.147-.107-.034-.21-.064-.334-.064-.381 0-.558.202-.563.304-.064.258.303.483.777.618.206.108.43.16.67.16 1.048 0 1.717-.5 2.102-.885a2.49 2.49 0 0 0 .587-1.587c0-1.154-.825-1.977-1.416-1.977-.342 0-.443.173-.455.465-1.04.212-.29.301-.16.431-.98.136-.293.352-1.215.55a1.88 1.88 0 0 1-.365.035c-.883 0-1.932-.462-1.932-1.73 0-.203-.041-.444-.167-.57a.304.304 0 0 0-.322-.052.324.324 0 0 0-.156.284c.356 3.763 2.602 7.07 6.55 9.648.295.197.568.502.624.62.342.76-.413 1.325-1.163 1.69-.374.232-.805.428-1.326.63A14 14 0 0 1 16 30z"/>
                        </svg>
                        Comprar pelo WhatsApp (15% OFF)
                      </a>
                    </div>
                    
                    <div className="bg-alphadark/50 rounded-lg p-4 flex items-start space-x-3">
                      <ShoppingCart className="h-5 w-5 text-alphablue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm font-medium">Entrega Grátis para todo o Brasil</p>
                        <p className="text-gray-400 text-xs">Prazo estimado de 7 a 15 dias úteis</p>
                        <p className="text-white text-xs mt-2">Em caso de dúvidas, entre em contato pelo WhatsApp: 13 99611-4479</p>
                      </div>
                    </div>
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

export default ProductPage;
