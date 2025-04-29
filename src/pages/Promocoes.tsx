
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";
import { useEffect } from "react";

const Promocoes = () => {
  // Filter products to get only those with discounts
  const discountedProducts = products.filter(product => product.discount);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Promoções</h1>
          <p className="text-gray-300 mb-8 max-w-3xl">
            Aproveite nossas ofertas especiais e descontos exclusivos em produtos selecionados. 
            Fique atento, pois nossas promoções são por tempo limitado!
          </p>
          
          {discountedProducts.length > 0 ? (
            <ProductGrid products={discountedProducts} title="Produtos em Oferta" />
          ) : (
            <div className="bg-alphadarkblue rounded-xl p-10 text-center">
              <h2 className="text-2xl text-white font-medium mb-3">Nenhuma promoção ativa no momento</h2>
              <p className="text-gray-300">
                No momento não temos promoções ativas, mas fique atento! Novas ofertas em breve.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Promocoes;
