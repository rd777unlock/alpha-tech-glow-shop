
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";
import { useEffect } from "react";

const Acessorios = () => {
  // Filter products to get only accessories
  const acessoriosProducts = products.filter(product => product.category === "Acessório");
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Acessórios</h1>
          <p className="text-gray-300 mb-8 max-w-3xl">
            Complemente seu dispositivo Apple com nossa seleção de acessórios originais e compatíveis. 
            Carregadores, cabos, fones de ouvido e muito mais para melhorar sua experiência com produtos Apple.
          </p>
          
          <ProductGrid products={acessoriosProducts} title="Todos os Acessórios" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Acessorios;
