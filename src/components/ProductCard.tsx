
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
  const discountedPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;
    
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (product.inStock) {
      addToCart(product);
      setAddedToCart(true);
      
      // Reset the button after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-alphadarkblue rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-5px] group">
      <div className="relative">
        {/* Main image */}
        <Link to={`/product/${product.id}`}>
          <div className="overflow-hidden aspect-square">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/300x300/alphadark/gray?text=Imagem+Indisponível";
              }}
            />
          </div>
          
          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-alphapurple text-white text-xs font-medium py-1 px-2 rounded-full">
                Novo
              </span>
            )}
            {product.discount && (
              <span className="bg-red-500 text-white text-xs font-medium py-1 px-2 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>
          
          {/* Fast shipping badge */}
          {product.fastShipping && (
            <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md text-white text-xs py-1 px-2 rounded-full flex items-center">
              <img 
                src="/loggi-logo.png" 
                alt="Loggi" 
                className="w-3 h-3 mr-1" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/12x12/alphadark/gray?text=L";
                }}
              />
              Entrega rápida
            </div>
          )}
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-white font-medium text-lg mb-1 hover:text-gradient transition-colors">
            {product.name}
          </h3>
        </Link>
        <span className="text-gray-400 text-sm">{product.category}</span>
        
        <div className="mt-3 flex items-end gap-2">
          <span className="text-white font-semibold text-xl">
            {formatPrice(discountedPrice)}
          </span>
          
          {product.discount && (
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <Link 
            to={`/product/${product.id}`}
            className="bg-white text-alphadark text-center font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Ver detalhes
          </Link>
          
          <button 
            className={`${
              addedToCart 
                ? 'bg-alphagreen' 
                : 'bg-gradient-tech'
            } text-white text-center font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center`}
            onClick={handleAddToCart}
            disabled={!product.inStock || addedToCart}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </>
            )}
          </button>
        </div>
        
        <div className="mt-3 text-xs text-center">
          <span className="text-alphagreen">✓</span>
          <span className="text-gray-400 ml-1">Garantia de 1 ano</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
