
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import products, { Product } from "../data/products";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
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
                  <button 
                    className={`bg-white text-alphadark font-medium py-3 px-6 rounded-lg 
                      ${!product.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 transition-colors'}`}
                    disabled={!product.inStock}
                  >
                    Adicionar ao Carrinho
                  </button>
                  
                  <a 
                    href={`https://wa.me/5511xxxxxxxxx?text=Olá! Tenho interesse no produto: ${product.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center
                      ${!product.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transition-opacity'}`}
                    {...(!product.inStock ? { 'aria-disabled': true, onClick: (e) => e.preventDefault() } : {})}
                  >
                    <svg className="w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Comprar via WhatsApp
                  </a>
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
