
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountedPrice = product.discount 
    ? Math.round(product.price * (1 - product.discount / 100)) 
    : product.price;
    
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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
          
          <a 
            href={`https://wa.me/5511xxxxxxxxx?text=Olá! Tenho interesse no produto: ${product.name}`}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-tech text-white text-center font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            Comprar via WhatsApp
          </a>
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
