// Serviço central para manipulação de dados do Admin
// TODO: Substituir mocks por chamadas de API futuramente
import { Product } from "../data/products";

// Mock de produtos
let productsMock: Product[] = [
  // ...adicione produtos mockados ou importe de products.ts...
];

// Mock de promoções
let promotionsMock = [
  { code: "BEMVINDO10", discount: 10, description: "10% de desconto na primeira compra", active: true },
  { code: "VERAO2023", discount: 15, description: "15% de desconto em acessórios", active: true },
  { code: "BLACKFRIDAY", discount: 20, description: "20% de desconto em todos os produtos", active: false },
];

// Mock de métricas
let metricsMock = {
  totalSales: 12850,
  totalVisits: 2467,
  cartAbandonment: 68,
  conversionRate: 3.2,
  pageViews: {
    home: 1235,
    products: 876,
    cart: 342,
    checkout: 156,
  },
};

export const adminService = {
  // Produtos
  getProducts: async (): Promise<Product[]> => {
    // TODO: Integrar com API
    return [...productsMock];
  },
  addProduct: async (product: Product) => {
    productsMock.push(product);
    // TODO: Integrar com API
  },
  updateProduct: async (product: Product) => {
    productsMock = productsMock.map((p) => (p.id === product.id ? product : p));
    // TODO: Integrar com API
  },
  deleteProduct: async (id: string) => {
    productsMock = productsMock.filter((p) => p.id !== id);
    // TODO: Integrar com API
  },

  // Promoções
  getPromotions: async () => {
    // TODO: Integrar com API
    return [...promotionsMock];
  },
  addPromotion: async (promo: any) => {
    promotionsMock.push(promo);
    // TODO: Integrar com API
  },
  // ...outros métodos para promoções...

  // Métricas
  getMetrics: async () => {
    // TODO: Integrar com API
    return { ...metricsMock };
  },

  // Configurações (admin, webhook, etc)
  getAdminEmail: async () => {
    // TODO: Integrar com API
    return "admin@exemplo.com";
  },
  updateAdminEmail: async (email: string) => {
    // TODO: Integrar com API
    return email;
  },
  getWebhookSecret: async () => {
    // TODO: Integrar com API
    return "whsec_mocked";
  },
  updateWebhookSecret: async (secret: string) => {
    // TODO: Integrar com API
    return secret;
  },
};
