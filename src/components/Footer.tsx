
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-alphadarkblue border-t border-white/5 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/68aaeb9d-d8b3-4d97-a8ff-8946becfdd01.png" 
              alt="Alpha Tech BR Logo" 
              className="h-12" 
            />
            <p className="text-gray-400 text-sm">
              Sua fonte definitiva para produtos tech premium, com foco em qualidade e atendimento personalizado.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/iphones" className="text-gray-400 hover:text-white transition-colors">iPhones</Link></li>
              <li><Link to="/acessorios" className="text-gray-400 hover:text-white transition-colors">Acessórios</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Sobre nós</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Suporte</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Informações</h3>
            <ul className="space-y-2">
              <li><Link to="/termos" className="text-gray-400 hover:text-white transition-colors">Termos e Condições</Link></li>
              <li><Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/entrega" className="text-gray-400 hover:text-white transition-colors">Informações de Entrega</Link></li>
              <li><Link to="/garantia" className="text-gray-400 hover:text-white transition-colors">Garantia</Link></li>
              <li><Link to="/pagamento" className="text-gray-400 hover:text-white transition-colors">Métodos de Pagamento</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-alphagreen" />
                <span className="text-gray-400">(11) 9xxxx-xxxx</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-alphagreen" />
                <span className="text-gray-400">contato@alphatechbr.com</span>
              </li>
              <li className="mt-4">
                <a 
                  href="https://wa.me/5511xxxxxxxxx" 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gradient-tech py-2 px-4 rounded-full text-white inline-flex items-center space-x-1 hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>Fale agora</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Alpha Tech BR. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
