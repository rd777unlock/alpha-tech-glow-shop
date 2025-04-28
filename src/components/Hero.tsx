
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-alphadark">
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-alphadark to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-alphapurple/20 blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-alphablue/20 blur-[100px] -z-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Descubra o </span>
              <span className="text-gradient">futuro</span>
              <span className="text-white"> da tecnologia</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto md:mx-0">
              Os melhores produtos Apple e acessórios premium com entrega rápida e garantia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/produtos" 
                className="bg-white text-alphadark font-medium py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors"
              >
                Ver produtos
              </Link>
              <Link 
                to="/promo" 
                className="bg-transparent border border-white/30 text-white font-medium py-3 px-6 rounded-full hover:bg-white/10 transition-colors"
              >
                Promoções
              </Link>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-4 pt-2">
              <div className="flex items-center space-x-1">
                <span className="text-alphagreen text-sm">✓</span>
                <span className="text-gray-400 text-sm">Frete rápido</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-alphagreen text-sm">✓</span>
                <span className="text-gray-400 text-sm">Garantia estendida</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-alphagreen text-sm">✓</span>
                <span className="text-gray-400 text-sm">Compra segura</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1603891128711-11b4b03bb138?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" 
                alt="iPhone 13 Pro" 
                className="w-full max-w-md rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl glow-border animate-pulse-glow"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-tech text-white text-sm font-medium py-2 px-4 rounded-full whitespace-nowrap">
                Novos iPhones disponíveis
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
