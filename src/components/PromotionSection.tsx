
import { Link } from 'react-router-dom';

const PromotionSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-alphadark to-alphadarkblue -z-10"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-alphapurple/5 to-transparent -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-alphablue/10 blur-[80px] -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-alphagreen/10 blur-[80px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="bg-alphadarkblue/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            <div className="md:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="iPhone Promoção" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full rotate-12">
                -20% OFF
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-gradient text-sm font-medium uppercase tracking-wider">Oferta Especial</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Promoção Relâmpago
              </h2>
              <p className="text-gray-300 mt-4 mb-6">
                Aproveite nossas promoções especiais em iPhones e acessórios selecionados. Ofertas por tempo limitado com frete grátis e garantia estendida!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl text-white font-bold">iPhones</div>
                  <div className="text-alphagreen mt-1">Até 20% OFF</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl text-white font-bold">Acessórios</div>
                  <div className="text-alphagreen mt-1">Até 30% OFF</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/promocoes" 
                  className="bg-white text-alphadark font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors text-center"
                >
                  Ver ofertas
                </Link>
                <a 
                  href="https://wa.me/5511xxxxxxxxx?text=Olá! Gostaria de saber mais sobre as promoções!"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-tech text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
              
              <div className="mt-6 flex items-center">
                <div className="mr-4 flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-alphablue flex items-center justify-center text-white text-xs">JM</div>
                  <div className="w-8 h-8 rounded-full bg-alphapurple flex items-center justify-center text-white text-xs">CM</div>
                  <div className="w-8 h-8 rounded-full bg-alphagreen flex items-center justify-center text-white text-xs">SP</div>
                </div>
                <div className="text-sm text-gray-400">+15 pessoas aproveitaram</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
