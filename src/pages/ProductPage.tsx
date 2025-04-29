
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import products, { Product } from "../data/products";
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  // Calculate discounted price
  const getDiscountedPrice = (product: Product) => {
    if (product.discount) {
      return Math.round(product.price * (1 - product.discount / 100));
    }
    return product.price;
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart(product);
      setAddedToCart(true);
      
      // Reset the button after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  const handleBuyNow = () => {
    if (product && product.inStock) {
      addToCart(product);
      navigate('/checkout');
    }
  };
  
  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find(p => p.id === id) || null;
    setProduct(foundProduct);
    
    if (foundProduct) {
      setSelectedImage(foundProduct.imageUrl);
      
      // Find related products (same category, excluding the current product)
      const related = products.filter(p => p.category === foundProduct.category && p.id !== id).slice(0, 4);
      setRelatedProducts(related);
    }

    // Reset added to cart status when product changes
    setAddedToCart(false);
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-alphadark flex flex-col">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">Produto não encontrado</h1>
            <p className="text-gray-400">O produto que você está procurando não existe ou foi removido.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* Product Images */}
              <div className="md:w-1/2">
                <div className="bg-alphadarkblue/40 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={selectedImage} 
                    alt={product.name} 
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
                
                {/* Thumbnail gallery - if we had multiple images */}
                <div className="flex gap-2">
                  <button 
                    className={`rounded-lg overflow-hidden ${selectedImage === product.imageUrl ? 'ring-2 ring-alphablue' : ''}`}
                    onClick={() => setSelectedImage(product.imageUrl)}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                </div>
              </div>
              
              {/* Product Information */}
              <div className="md:w-1/2">
                <div className="mb-2 flex items-center">
                  <span className="text-gray-400">{product.category}</span>
                  {product.isNew && (
                    <span className="ml-3 bg-alphapurple text-white text-xs font-medium py-1 px-2 rounded-full">
                      Novo
                    </span>
                  )}
                  {product.discount && (
                    <span className="ml-3 bg-red-500 text-white text-xs font-medium py-1 px-2 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
                
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(getDiscountedPrice(product))}
                  </span>
                  
                  {product.discount && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-6">
                  {product.description}
                </p>
                
                <div className="bg-alphadarkblue/30 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-semibold mb-3">Características:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-alphagreen mr-2">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-alphadarkblue/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Disponibilidade:</h3>
                      <p className={`text-sm ${product.inStock ? 'text-alphagreen' : 'text-red-500'}`}>
                        {product.inStock ? 'Em estoque' : 'Indisponível'}
                      </p>
                    </div>
                    
                    {product.fastShipping && (
                      <div>
                        <h3 className="text-white font-semibold">Entrega:</h3>
                        <div className="flex items-center text-alphagreen text-sm">
                          <img 
                            src="/loggi-logo.png" 
                            alt="Loggi" 
                            className="w-4 h-4 mr-1"
                          />
                          Entrega rápida
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-white font-semibold">Garantia:</h3>
                      <p className="text-sm text-gray-300">1 ano</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    className={`bg-white text-alphadark font-medium py-3 px-6 rounded-lg h-auto
                      ${!product.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transition-colors'}`}
                    disabled={!product.inStock || addedToCart}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Adicionado
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                  
                  <Button
                    className={`bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg h-auto
                      ${!product.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`}
                    disabled={!product.inStock}
                    onClick={handleBuyNow}
                  >
                    Comprar Agora
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-alphagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Compra Segura
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-alphagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Garantia de 1 Ano
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-alphagreen" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pagamentos Seguros
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-alphadarkblue/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-white mb-8">Produtos Relacionados</h2>
              
              <ProductGrid products={relatedProducts} showFilter={false} />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
