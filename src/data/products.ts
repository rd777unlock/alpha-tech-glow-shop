
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
  fastShipping?: boolean;
}

const products: Product[] = [
  {
    id: "iphone-13-pro-max",
    name: "iPhone 13 Pro Max",
    category: "iPhone",
    price: 7999,
    imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "O iPhone 13 Pro Max é o modelo mais avançado da linha iPhone 13, com tela Super Retina XDR de 6,7 polegadas, câmera Pro de 12MP e chip A15 Bionic.",
    features: ["Tela Super Retina XDR de 6,7 polegadas", "Chip A15 Bionic", "Sistema de câmera Pro de 12MP", "Até 28 horas de reprodução de vídeo", "Face ID"],
    inStock: true,
    isNew: true,
    fastShipping: true
  },
  {
    id: "iphone-13-pro",
    name: "iPhone 13 Pro",
    category: "iPhone",
    price: 6999,
    imageUrl: "https://images.unsplash.com/photo-1638303345113-f93a4ebd0d28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "O iPhone 13 Pro combina design elegante com desempenho excepcional, tela Super Retina XDR de 6,1 polegadas, câmera Pro de 12MP e chip A15 Bionic.",
    features: ["Tela Super Retina XDR de 6,1 polegadas", "Chip A15 Bionic", "Sistema de câmera Pro de 12MP", "Até 22 horas de reprodução de vídeo", "Face ID"],
    inStock: true,
    isNew: true,
    fastShipping: true
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    category: "iPhone",
    price: 5999,
    imageUrl: "https://images.unsplash.com/photo-1632582593957-14d57ff3f55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "O iPhone 13 oferece tela Super Retina XDR de 6,1 polegadas, sistema de câmera dupla de 12MP e chip A15 Bionic para desempenho excepcional.",
    features: ["Tela Super Retina XDR de 6,1 polegadas", "Chip A15 Bionic", "Sistema de câmera dupla de 12MP", "Até 19 horas de reprodução de vídeo", "Face ID"],
    inStock: true,
    discount: 10,
    fastShipping: true
  },
  {
    id: "iphone-13-mini",
    name: "iPhone 13 Mini",
    category: "iPhone",
    price: 4999,
    imageUrl: "https://images.unsplash.com/photo-1621687946327-bbc6ee289f79?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "O iPhone 13 Mini é compacto mas poderoso, com tela Super Retina XDR de 5,4 polegadas, sistema de câmera dupla de 12MP e chip A15 Bionic.",
    features: ["Tela Super Retina XDR de 5,4 polegadas", "Chip A15 Bionic", "Sistema de câmera dupla de 12MP", "Até 17 horas de reprodução de vídeo", "Face ID"],
    inStock: true,
    discount: 15
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Acessório",
    price: 1999,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Os AirPods Pro oferecem cancelamento ativo de ruído, modo Transparência e design personalizado para conforto durante todo o dia.",
    features: ["Cancelamento ativo de ruído", "Modo Transparência", "Ajuste personalizado", "Resistente a suor e água", "Áudio espacial"],
    inStock: true,
    fastShipping: true
  },
  {
    id: "carregador-usb-c",
    name: "Carregador USB-C 20W",
    category: "Acessório",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1592890288564-76628a30a657?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Carregador USB-C de 20W da Apple para carregamento rápido do iPhone, iPad e outros dispositivos compatíveis.",
    features: ["Potência de 20W", "Conector USB-C", "Carregamento rápido", "Compatível com iPhone e iPad", "Design compacto"],
    inStock: true,
    discount: 5
  },
  {
    id: "cabo-usb-c-lightning",
    name: "Cabo USB-C para Lightning",
    category: "Acessório",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1602526429245-7026199c11d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Cabo USB-C para Lightning da Apple para carregamento rápido do iPhone e outros dispositivos compatíveis.",
    features: ["Comprimento de 1m", "Conector USB-C e Lightning", "Carregamento rápido", "Transferência de dados", "Design durável"],
    inStock: true,
    discount: 5,
    fastShipping: true
  },
  {
    id: "magsafe-charger",
    name: "Carregador MagSafe",
    category: "Acessório",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1616348579998-a024c78d18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "O carregador MagSafe se conecta magneticamente ao iPhone 12 e modelos posteriores para carregamento sem fio mais rápido e conveniente.",
    features: ["Conexão magnética", "Carregamento sem fio", "Até 15W de potência", "Compatível com iPhone 12 e posteriores", "Design compacto"],
    inStock: false,
    isNew: true
  }
];

export default products;
