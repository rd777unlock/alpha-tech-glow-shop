import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import { Product } from "../data/products";
import { useLocation } from "react-router-dom";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showFilter?: boolean;
}

const ProductGrid = ({
  products,
  title,
  showFilter = true,
}: ProductGridProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const location = useLocation();

  // Extract unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Handle search results from location state
  useEffect(() => {
    if (location.state?.searchResults && location.state?.searchQuery) {
      setFilteredProducts(location.state.searchResults);
      setActiveCategory(null);
    } else if (activeCategory === null) {
      setFilteredProducts(products);
    }
  }, [location.state, products]);

  // Filter products when category changes
  useEffect(() => {
    if (activeCategory === null) {
      // If we have search results, keep them, otherwise show all products
      if (!location.state?.searchResults) {
        setFilteredProducts(products);
      }
    } else {
      // If category is selected, filter from either search results or all products
      const sourceProducts = location.state?.searchResults || products;
      setFilteredProducts(
        sourceProducts.filter((product) => product.category === activeCategory),
      );
    }
  }, [activeCategory, products, location.state]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
        )}

        {showFilter && categories.length > 1 && (
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
