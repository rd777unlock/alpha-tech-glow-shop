
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Sobre Nós</h1>
              
              <div className="rounded-2xl overflow-hidden mb-10">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                  alt="Alpha Tech BR escritório" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="prose prose-invert max-w-none">
                <h2 className="text-gradient text-3xl font-bold">Nossa História</h2>
                <p className="text-gray-300 mb-6">
                  A Alpha Tech BR nasceu da paixão por tecnologia e da vontade de oferecer produtos premium com um atendimento diferenciado no mercado brasileiro. Fundada em 2018, nossa empresa se consolidou como referência em produtos Apple e acessórios de alta qualidade.
                </p>
                
                <h2 className="text-gradient text-3xl font-bold mt-10">Nossa Missão</h2>
                <p className="text-gray-300 mb-6">
                  Proporcionar a melhor experiência em produtos tecnológicos, com foco em qualidade, atendimento personalizado e suporte contínuo aos nossos clientes. Queremos que cada cliente tenha acesso ao que há de melhor em tecnologia, com a segurança e confiança que merecem.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                  <div className="bg-alphadarkblue/70 rounded-xl p-6">
                    <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Inovação</h3>
                    <p className="text-gray-400">
                      Estamos sempre atualizados com as últimas tendências e lançamentos do mundo da tecnologia.
                    </p>
                  </div>
                  
                  <div className="bg-alphadarkblue/70 rounded-xl p-6">
                    <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Confiança</h3>
                    <p className="text-gray-400">
                      Construímos relacionamentos duradouros baseados em transparência e produtos de qualidade.
                    </p>
                  </div>
                  
                  <div className="bg-alphadarkblue/70 rounded-xl p-6">
                    <div className="w-12 h-12 bg-gradient-tech rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Atendimento</h3>
                    <p className="text-gray-400">
                      Oferecemos suporte personalizado antes, durante e após a compra para total satisfação.
                    </p>
                  </div>
                </div>
                
                <h2 className="text-gradient text-3xl font-bold mt-10">Por que escolher a Alpha Tech BR?</h2>
                <ul className="text-gray-300 space-y-3 ml-6 mb-6">
                  <li className="flex items-start">
                    <span className="text-alphagreen mr-2">✓</span>
                    <span>Produtos originais com garantia estendida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-alphagreen mr-2">✓</span>
                    <span>Entrega rápida para todo o Brasil</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-alphagreen mr-2">✓</span>
                    <span>Atendimento personalizado via WhatsApp</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-alphagreen mr-2">✓</span>
                    <span>Suporte técnico especializado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-alphagreen mr-2">✓</span>
                    <span>Parcelamento em até 12x sem juros</span>
                  </li>
                </ul>
                
                <div className="mt-10 bg-gradient-to-br from-alphadarkblue to-alphadark p-8 rounded-2xl border border-white/5">
                  <h3 className="text-white text-2xl font-bold mb-4">Fale Conosco</h3>
                  <p className="text-gray-300 mb-6">
                    Estamos à disposição para tirar suas dúvidas e ajudar com qualquer questão relacionada aos nossos produtos e serviços.
                  </p>
                  <a 
                    href="https://wa.me/5511xxxxxxxxx"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gradient-tech inline-flex items-center text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Conversar pelo WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
