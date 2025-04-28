
import { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Support = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  
  const toggleQuestion = (index: number) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };
  
  const faqs = [
    {
      question: "Como funciona a garantia dos produtos?",
      answer: "Todos os nossos produtos possuem garantia mínima de 1 ano. Os produtos Apple contam com a garantia oficial da fabricante, e nós oferecemos 3 meses adicionais em todos os produtos da nossa loja. Para acionar a garantia, basta entrar em contato com nosso suporte via WhatsApp ou email."
    },
    {
      question: "Qual o prazo de entrega dos produtos?",
      answer: "O prazo de entrega varia de acordo com a sua localização. Trabalhamos com as principais transportadoras do Brasil e oferecemos frete expresso via Loggi para algumas regiões. Após a confirmação do pagamento, produtos em estoque são despachados em até 24 horas úteis."
    },
    {
      question: "Os produtos são originais?",
      answer: "Sim, todos os nossos produtos são 100% originais, com nota fiscal e garantia. Não trabalhamos com réplicas ou produtos recondicionados."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos pagamentos via PIX, boleto bancário, transferência bancária e cartões de crédito em até 12x sem juros (dependendo do valor da compra)."
    },
    {
      question: "Como funciona a troca ou devolução?",
      answer: "Você tem até 7 dias corridos após o recebimento para solicitar a devolução por insatisfação, conforme o Código de Defesa do Consumidor. Em caso de defeito, a troca pode ser solicitada dentro do período de garantia. Entre em contato com nosso suporte para iniciar o processo."
    },
    {
      question: "Como acompanhar meu pedido?",
      answer: "Após a confirmação do pagamento e envio do pedido, você receberá por email e WhatsApp o código de rastreamento para acompanhar a entrega."
    }
  ];
  
  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Suporte</h1>
              
              <div className="bg-alphadarkblue/50 rounded-2xl p-8 mb-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="md:w-1/3 flex flex-col items-center md:items-start">
                    <div className="w-20 h-20 bg-gradient-tech rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Atendimento</h2>
                    <p className="text-gray-400 text-center md:text-left">Estamos prontos para ajudar</p>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-alphadark rounded-xl p-4">
                        <div className="flex items-center mb-3">
                          <svg className="w-5 h-5 text-alphagreen mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <h3 className="text-white font-semibold">Email</h3>
                        </div>
                        <p className="text-gray-400">contato@alphatechbr.com</p>
                        <p className="text-gray-500 text-sm mt-1">Resposta em até 24h</p>
                      </div>
                      
                      <div className="bg-alphadark rounded-xl p-4">
                        <div className="flex items-center mb-3">
                          <svg className="w-5 h-5 text-alphagreen mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <h3 className="text-white font-semibold">Telefone</h3>
                        </div>
                        <p className="text-gray-400">(11) 9xxxx-xxxx</p>
                        <p className="text-gray-500 text-sm mt-1">Seg-Sex: 9h às 18h</p>
                      </div>
                      
                      <div className="bg-alphadark rounded-xl p-4 sm:col-span-2">
                        <div className="flex items-center mb-3">
                          <svg className="w-5 h-5 text-alphagreen mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <h3 className="text-white font-semibold">WhatsApp</h3>
                        </div>
                        <p className="text-gray-400 mb-3">(11) 9xxxx-xxxx</p>
                        <a 
                          href="https://wa.me/5511xxxxxxxxx"
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gradient-tech inline-flex items-center text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                          <svg className="w-4 h-4 mr-1 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                          </svg>
                          Falar agora
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-8">Perguntas Frequentes</h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-alphadarkblue/50 rounded-xl overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center p-5 text-left"
                        onClick={() => toggleQuestion(index)}
                      >
                        <span className="text-white font-medium">{faq.question}</span>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${activeQuestion === index ? 'transform rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {activeQuestion === index && (
                        <div className="p-5 pt-0 text-gray-400 border-t border-white/5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact Form Section */}
              <div className="bg-alphadarkblue/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Entre em Contato</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 mb-1">Nome</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full bg-alphadark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-alphablue" 
                        placeholder="Seu nome"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-alphadark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-alphablue" 
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-300 mb-1">Assunto</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full bg-alphadark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-alphablue" 
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-300 mb-1">Mensagem</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full bg-alphadark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-alphablue" 
                      placeholder="Sua mensagem"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="bg-gradient-tech text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
