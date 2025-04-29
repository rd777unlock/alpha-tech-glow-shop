import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import products from "../data/products";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Produtos = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top on page load and check for search query
  useEffect(() => {
    window.scrollTo(0, 0);

    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    } else {
      setSearchQuery("");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />

      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          {searchQuery ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Resultados da busca: {searchQuery}
              </h1>
              <p className="text-gray-300 mb-8">
                {location.state?.searchResults?.length || 0} produtos
                encontrados
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Todos os Produtos
              </h1>
              <p className="text-gray-300 mb-8 max-w-3xl">
                Descubra nossa coleção completa de produtos Apple e acessórios
                premium, selecionados para garantir qualidade e autenticidade.
                Todos os produtos com garantia e o suporte exclusivo Alpha Tech
                BR.
              </p>
            </>
          )}

          <ProductGrid products={products} title="Catálogo Completo" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;
