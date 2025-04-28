
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import PromotionSection from "../components/PromotionSection";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

const Index = () => {
  // Featured products (newest or with discount)
  const featuredProducts = products.filter(product => product.isNew || product.discount);
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Produtos em Destaque</h2>
            </div>
            
            <ProductGrid products={featuredProducts} showFilter={false} />
          </div>
        </div>
        
        <PromotionSection />
        
        <div className="py-16 bg-alphadarkblue/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Todos os Produtos</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Descubra nosso catálogo completo de produtos premium da Apple e acessórios selecionados com garantia e entrega rápida.
              </p>
            </div>
            
            <ProductGrid products={products} />
          </div>
        </div>
        
        {/* Brand badges */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-xl font-medium text-white">Compre com confiança</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-alphadarkblue/70 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium">Compra Segura</h4>
                <p className="text-gray-400 text-sm mt-1">Ambiente seguro para suas compras</p>
              </div>
              
              <div className="bg-alphadarkblue/70 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium">Entrega Rápida</h4>
                <p className="text-gray-400 text-sm mt-1">Parceria com as melhores transportadoras</p>
              </div>
              
              <div className="bg-alphadarkblue/70 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium">Garantia Estendida</h4>
                <p className="text-gray-400 text-sm mt-1">Até 1 ano de garantia em todos os produtos</p>
              </div>
              
              <div className="bg-alphadarkblue/70 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="text-white font-medium">Suporte Premium</h4>
                <p className="text-gray-400 text-sm mt-1">Atendimento personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
