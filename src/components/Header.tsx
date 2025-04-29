import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { getItemCount } = useCart();
<<<<<<< HEAD
  const cartItemCount = getItemCount();
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Import products dynamically to search through them
    import("../data/products").then(({ default: products }) => {
      // Filter products based on search query
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setIsSearching(false);

      // Navigate to products page with search query as state
      navigate("/produtos", { state: { searchQuery, searchResults: results } });

      // Close mobile menu if open
      setIsMenuOpen(false);
    });
=======
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Update cart count when items change
  useEffect(() => {
    setCartItemCount(getItemCount());
  }, [getItemCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just navigate to the products page
    // In the future, this could be enhanced to search properly
    window.location.href = `/produtos?search=${encodeURIComponent(searchQuery)}`;
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-alphadark/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            alt="Alpha Tech BR Logo"
            className="h-10 md:h-12"
            src="/lovable-uploads/582ef411-fc1d-4a9d-ac78-fab3f9f31069.png"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white hover:text-gradient font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/iphones"
            className="text-white hover:text-gradient font-medium transition-colors"
          >
            iPhones
          </Link>
          <Link
            to="/acessorios"
            className="text-white hover:text-gradient font-medium transition-colors"
          >
            Acessórios
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-gradient font-medium transition-colors"
          >
            Sobre
          </Link>
          <Link
            to="/support"
            className="text-white hover:text-gradient font-medium transition-colors"
          >
            Suporte
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
<<<<<<< HEAD
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="bg-alphadarkblue text-white rounded-full pl-4 pr-10 py-2 w-40 focus:w-60 focus:outline-none focus:ring-1 focus:ring-alphablue transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>
          </div>

          <Link
            to="/cart"
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors relative"
          >
=======
          {showSearch ? (
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="bg-black/30 text-white border border-white/20 rounded-full px-4 py-1 text-sm w-[200px] focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 text-white"
              >
                <Search size={16} />
              </button>
            </form>
          ) : (
            <button 
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors" 
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>
          )}
          
          <Link to="/cart" className="text-white p-2 rounded-full hover:bg-white/10 transition-colors relative">
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-alphagreen text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-alphadarkblue/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
<<<<<<< HEAD
            {/* Mobile search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 mb-2"
            >
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="bg-alphadark text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-alphablue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-alphablue hover:bg-alphablue/80 text-white p-2 rounded-lg transition-colors"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={20} />
                )}
              </button>
            </form>

            <Link
              to="/"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/iphones"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              iPhones
            </Link>
            <Link
              to="/acessorios"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Acessórios
            </Link>
            <Link
              to="/about"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/support"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Suporte
            </Link>
            <Link
              to="/admin"
              className="text-white py-2 hover:text-gradient font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
=======
            <Link to="/" className="text-white py-2 hover:text-gradient font-medium">Home</Link>
            <Link to="/iphones" className="text-white py-2 hover:text-gradient font-medium">iPhones</Link>
            <Link to="/acessorios" className="text-white py-2 hover:text-gradient font-medium">Acessórios</Link>
            <Link to="/about" className="text-white py-2 hover:text-gradient font-medium">Sobre</Link>
            <Link to="/support" className="text-white py-2 hover:text-gradient font-medium">Suporte</Link>
            <Link to="/admin-login" className="text-white py-2 hover:text-gradient font-medium">Admin</Link>
>>>>>>> d7952de85cc29daa40d5d3636011b14b55a16e7f
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
