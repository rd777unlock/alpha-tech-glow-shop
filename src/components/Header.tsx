import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="fixed top-0 left-0 right-0 bg-alphadark/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img alt="Alpha Tech BR Logo" className="h-10 md:h-12" src="/lovable-uploads/582ef411-fc1d-4a9d-ac78-fab3f9f31069.png" />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-gradient font-medium transition-colors">Home</Link>
          <Link to="/iphones" className="text-white hover:text-gradient font-medium transition-colors">iPhones</Link>
          <Link to="/acessorios" className="text-white hover:text-gradient font-medium transition-colors">Acessórios</Link>
          <Link to="/about" className="text-white hover:text-gradient font-medium transition-colors">Sobre</Link>
          <Link to="/support" className="text-white hover:text-gradient font-medium transition-colors">Suporte</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <Search size={20} />
          </button>
          <Link to="/cart" className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <ShoppingCart size={20} />
          </Link>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-alphadarkblue/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-white py-2 hover:text-gradient font-medium">Home</Link>
            <Link to="/iphones" className="text-white py-2 hover:text-gradient font-medium">iPhones</Link>
            <Link to="/acessorios" className="text-white py-2 hover:text-gradient font-medium">Acessórios</Link>
            <Link to="/about" className="text-white py-2 hover:text-gradient font-medium">Sobre</Link>
            <Link to="/support" className="text-white py-2 hover:text-gradient font-medium">Suporte</Link>
          </div>
        </div>}
    </header>;
};
export default Header;