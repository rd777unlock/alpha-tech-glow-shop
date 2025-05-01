import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

import {
  PlusCircle,
  Edit,
  Trash2,
  BarChart3,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  DollarSign,
} from "lucide-react";
import products, { Product } from "../data/products";
import { adminService } from "../lib/adminService";

import { PlusCircle, Edit, Trash2, BarChart3, Package, ShoppingCart, CreditCard, Users, DollarSign, Mail, AlertTriangle } from "lucide-react";
import products, { Product } from "../data/products";
import { useIsMobile } from "../hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
d7952de85cc29daa40d5d3636011b14b55a16e7f

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productsList, setProductsList] = useState<Product[]>([...products]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminEmail, setAdminEmail] = useState("loja.alphatechbr@gmail.com");
  const [newEmail, setNewEmail] = useState("");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    description: "",
    imageUrl: "",
    features: [],
    inStock: true,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalVisits: 0,
    cartAbandonment: 0,
    conversionRate: 0,
    pageViews: {
      home: 0,
      products: 0,
      cart: 0,
      checkout: 0,
    },
  });
  const [adminEmail, setAdminEmail] = useState("admin@exemplo.com");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState("whsec_mocked");
  const [isUpdatingWebhook, setIsUpdatingWebhook] = useState(false);

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // useEffect para carregar dados iniciais do service
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      setProductsList(await adminService.getProducts());
      setMetrics(await adminService.getMetrics());
      setAdminEmail(await adminService.getAdminEmail());
      setWebhookSecret(await adminService.getWebhookSecret());
      setIsAuthenticated(true);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for admin authentication in localStorage
        const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
        const storedEmail = localStorage.getItem('adminEmail');
        
        if (isAdmin && storedEmail) {
          setIsAuthenticated(true);
          setAdminEmail(storedEmail);
        } else {
          // Redirect to login if not authenticated
          navigate('/admin-login');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/admin-login');
      }
    };

    checkAuth();
    
    // Dados simulados para métricas
    setMetrics({
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
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  const updateAdminEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setAdminEmail(newEmail);
    localStorage.setItem('adminEmail', newEmail);
    
    toast({
      title: "Email atualizado",
      description: "O email de administrador foi atualizado com sucesso.",
    });
    
    setNewEmail("");
  };
d7952de85cc29daa40d5d3636011b14b55a16e7f

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          features: [...editingProduct.features, featureInput.trim()],
        });
      } else {
        setNewProduct({
          ...newProduct,
          features: [...(newProduct.features || []), featureInput.trim()],
        });
      }
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (editingProduct) {
      const updatedFeatures = [...editingProduct.features];
      updatedFeatures.splice(index, 1);
      setEditingProduct({
        ...editingProduct,
        features: updatedFeatures,
      });
    } else {
      const updatedFeatures = [...(newProduct.features || [])];
      updatedFeatures.splice(index, 1);
      setNewProduct({
        ...newProduct,
        features: updatedFeatures,
      });
    }
  };

  // Funções CRUD de produtos usando adminService
  const handleSaveProduct = async () => {
    if (editingProduct) {
      await adminService.updateProduct(editingProduct);
      setProductsList(await adminService.getProducts());
      toast({
        title: "Produto atualizado",
        description: `${editingProduct.name} foi atualizado com sucesso.`,
      });
      setEditingProduct(null);
    } else if (newProduct.name && newProduct.price && newProduct.imageUrl) {
      const product = {
        ...newProduct,
        id: `product-${Date.now()}`,
        features: newProduct.features || [],
        inStock: newProduct.inStock || true,
      } as Product;
      await adminService.addProduct(product);
      setProductsList(await adminService.getProducts());
      setNewProduct({
        name: "",
        category: "",
        price: 0,
        description: "",
        imageUrl: "",
        features: [],
        inStock: true,
      });
      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado com sucesso.`,
      });
    } else {
      toast({
        title: "Erro ao salvar produto",
        description: "Preencha os campos obrigatórios: nome, preço e imagem.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      description: "",
      imageUrl: "",
      features: [],
      inStock: true,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    await adminService.deleteProduct(productId);
    setProductsList(await adminService.getProducts());
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleAddPromotion = () => {
    if (promotionCode && discountAmount > 0) {
      toast({
        title: "Promoção adicionada",
        description: `Promoção ${promotionCode} com ${discountAmount}% de desconto foi criada.`,
      });
      setPromotionCode("");
      setDiscountAmount(0);
    } else {
      toast({
        title: "Erro ao adicionar promoção",
        description: "Preencha código da promoção e valor do desconto.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-alphadark flex flex-col">
        <Header />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin-login');
    return null;
  }

  return (
    <div className="min-h-screen bg-alphadark flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Painel Administrativo
          </h1>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-2">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-alphablue"
              >
                Produtos
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="data-[state=active]:bg-alphablue"
              >
                Promoções
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                className="data-[state=active]:bg-alphablue"
              >
                Pagamentos
              </TabsTrigger>
              <TabsTrigger
                value="metrics"
                className="data-[state=active]:bg-alphablue"
              >
                Métricas
              </TabsTrigger>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Painel Administrativo</h1>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm hidden md:inline-block">
                Logado como: {adminEmail}
              </span>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-white hover:bg-red-500/20 border border-red-500/30"
              >
                Sair
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-2 mb-2' : 'grid-cols-5 gap-2'}`}>
              <TabsTrigger value="products" className="data-[state=active]:bg-alphablue">Produtos</TabsTrigger>
              <TabsTrigger value="promotions" className="data-[state=active]:bg-alphablue">Promoções</TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-alphablue">Pagamentos</TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-alphablue">Métricas</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-alphablue">Configurações</TabsTrigger>
d7952de85cc29daa40d5d3636011b14b55a16e7f
            </TabsList>

            {/* Aba de Produtos */}
            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulário de Produto */}
                <Card className="lg:col-span-1 bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingProduct ? "Editar Produto" : "Adicionar Produto"}
                    </CardTitle>
                    <CardDescription>
                      {editingProduct
                        ? `Editando: ${editingProduct.name}`
                        : "Preencha os dados para adicionar um novo produto"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Produto*</Label>
                      <Input
                        id="name"
                        value={
                          editingProduct ? editingProduct.name : newProduct.name
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            : setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                        }
                        placeholder="iPhone 14 Pro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Input
                        id="category"
                        value={
                          editingProduct
                            ? editingProduct.category
                            : newProduct.category
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                category: e.target.value,
                              })
                            : setNewProduct({
                                ...newProduct,
                                category: e.target.value,
                              })
                        }
                        placeholder="iPhone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preço*</Label>
                      <Input
                        id="price"
                        type="number"
                        value={
                          editingProduct
                            ? editingProduct.price
                            : newProduct.price
                        }
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                price: value,
                              })
                            : setNewProduct({ ...newProduct, price: value });
                        }}
                        placeholder="5999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={
                          editingProduct
                            ? editingProduct.discount || 0
                            : newProduct.discount || 0
                        }
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                discount: value,
                              })
                            : setNewProduct({ ...newProduct, discount: value });
                        }}
                        placeholder="10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">URL da Imagem*</Label>
                      <Input
                        id="imageUrl"
                        value={
                          editingProduct
                            ? editingProduct.imageUrl
                            : newProduct.imageUrl
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                imageUrl: e.target.value,
                              })
                            : setNewProduct({
                                ...newProduct,
                                imageUrl: e.target.value,
                              })
                        }
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={
                          editingProduct
                            ? editingProduct.description
                            : newProduct.description
                        }
                        onChange={(e) =>
                          editingProduct
                            ? setEditingProduct({
                                ...editingProduct,
                                description: e.target.value,
                              })
                            : setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                              })
                        }
                        placeholder="Descrição detalhada do produto..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Características</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="Adicionar característica"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddFeature();
                            }
                          }}
                        />
                        <Button onClick={handleAddFeature} type="button">
                          +
                        </Button>
                      </div>

                      <div className="mt-2 space-y-1">
                        {editingProduct &&
                          editingProduct.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-alphadark p-2 rounded"
                            >
                              <span className="text-sm">{feature}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFeature(index)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                        {!editingProduct &&
                          newProduct.features &&
                          newProduct.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-alphadark p-2 rounded"
                            >
                              <span className="text-sm">{feature}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFeature(index)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        onClick={handleSaveProduct}
                        className="bg-alphablue hover:bg-alphablue/80"
                      >
                        {editingProduct
                          ? "Atualizar Produto"
                          : "Adicionar Produto"}
                      </Button>

                      {editingProduct && (
                        <Button
                          variant="outline"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Produtos */}
                <div className="lg:col-span-2">
                  <Card className="bg-alphadarkblue border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Produtos Cadastrados
                      </CardTitle>
                      <CardDescription>
                        Gerencie os produtos disponíveis na loja
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-[600px] overflow-y-auto">
                      <div className="space-y-4">
                        {productsList.map((product) => (
                          <div
                            key={product.id}
                            className="flex gap-4 p-4 bg-alphadark rounded-lg border border-gray-700"
                          >
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://placehold.co/100x100/alphadark/gray?text=Imagem+Indisponível";
                                }}
                              />
                            </div>

                            <div className="flex-grow">
                              <h3 className="text-white font-medium">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>{product.category}</span>
                                <span>•</span>
                                <span className="text-white font-medium">
                                  {product.price.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </span>
                                {product.discount && (
                                  <span className="text-red-400">
                                    -{product.discount}%
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm truncate mt-1">
                                {product.description?.substring(0, 60)}...
                              </p>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Aba de Promoções */}
            <TabsContent value="promotions">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Nova Promoção</CardTitle>
                    <CardDescription>
                      Crie códigos promocionais e descontos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="promoCode">Código Promocional</Label>
                      <Input
                        id="promoCode"
                        value={promotionCode}
                        onChange={(e) => setPromotionCode(e.target.value)}
                        placeholder="VERAO2023"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountAmount">Desconto (%)</Label>
                      <Input
                        id="discountAmount"
                        type="number"
                        value={discountAmount}
                        onChange={(e) =>
                          setDiscountAmount(Number(e.target.value))
                        }
                        placeholder="10"
                      />
                    </div>

                    <Button
                      onClick={handleAddPromotion}
                      className="bg-alphablue hover:bg-alphablue/80 w-full mt-4"
                    >
                      Adicionar Promoção
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Promoções Ativas
                    </CardTitle>
                    <CardDescription>
                      Gerencie as promoções disponíveis no site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>
                          <h3 className="text-white font-medium">BEMVINDO10</h3>
                          <p className="text-gray-400 text-sm">
                            10% de desconto na primeira compra
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm">Ativo</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>

                          <h3 className="text-white font-medium">VERAO2023</h3>
                          <p className="text-gray-400 text-sm">
                            15% de desconto em acessórios
                          </p>

                          <h3 className="text-white font-medium">ZAPP15</h3>
                          <p className="text-gray-400 text-sm">15% de desconto em compras pelo WhatsApp</p>
d7952de85cc29daa40d5d3636011b14b55a16e7f
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm">Ativo</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700 opacity-50">
                        <div>
                          <h3 className="text-white font-medium">
                            BLACKFRIDAY
                          </h3>
                          <p className="text-gray-400 text-sm">
                            20% de desconto em todos os produtos
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 text-sm">Inativo</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Pagamentos */}
            <TabsContent value="payments">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-alphadarkblue border-gray-700">
                  <CardHeader>

                    <CardTitle className="text-white">
                      Integrações de Pagamento
                    </CardTitle>

                    <CardTitle className="text-white">Configuração de Pagamentos</CardTitle>
d7952de85cc29daa40d5d3636011b14b55a16e7f
                    <CardDescription>
                      Configure os métodos de pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">

                      <Label htmlFor="paymentApiKey">
                        Chave API de Pagamento
                      </Label>
                      <Input
                        id="paymentApiKey"
                        value="yPOImFfvyFbjVN9LyRmYq6SDXp29BaMorOo7wQP3aXmVCtX5lAD4x8bvMhQf"
                        type="password"
                        readOnly
                      />
                      <p className="text-xs text-gray-400">
                        API configurada em 29/04/2025
                      </p>

                      <Label>API Keys de Pagamento</Label>
                      <div className="bg-alphadark p-4 rounded-lg space-y-3">
                        <div>
                          <Label htmlFor="publicKey" className="text-xs text-gray-400">Chave Pública</Label>
                          <Input 
                            id="publicKey"
                            value="pk_cxB1fS-bnOsQr8c2NIiwN61astAjC4IBJJ4bBEvrQH0nDL5G"
                            className="font-mono text-xs"
                            readOnly
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="privateKey" className="text-xs text-gray-400">Chave Privada</Label>
                          <Input 
                            id="privateKey"
                            type="password" 
                            value="●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●"
                            className="font-mono text-xs"
                            readOnly
                          />
                          <p className="text-xs text-gray-400 mt-1">Configuradas em 29/04/2025</p>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-alphablue text-alphablue"
                          >
                            Atualizar chaves
                          </Button>
                        </div>
                      </div>
d7952de85cc29daa40d5d3636011b14b55a16e7f
                    </div>

                    <div className="space-y-2 pt-4">
                      <Label>Métodos de Pagamento Habilitados</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="credit" checked readOnly />
                          <label htmlFor="credit" className="text-gray-300">
                            Cartão de Crédito
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="pix" checked readOnly />
                          <label htmlFor="pix" className="text-gray-300">
                            Pix
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="boleto" checked readOnly />
                          <label htmlFor="boleto" className="text-gray-300">
                            Boleto Bancário
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="whatsapp"
                            checked
                            readOnly
                          />
                          <label htmlFor="whatsapp" className="text-gray-300">
                            WhatsApp
                          </label>
                        </div>
                      </div>
                    </div>

                    <Button className="bg-alphablue hover:bg-alphablue/80 w-full mt-4">
                      Testar Conexão com API
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Últimas Transações
                    </CardTitle>
                    <CardDescription>
                      Visão geral das transações recentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>
                          <h3 className="text-white font-medium">
                            Pedido #ALF238764
                          </h3>
                          <p className="text-gray-400 text-sm">
                            iPhone 13 Pro Max (x1)
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date().toLocaleDateString("pt-BR")} - Cartão de
                            Crédito
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white font-medium">
                            R$ 7.999,00
                          </span>
                          <span className="text-green-400 text-sm">
                            Aprovado
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>
                          <h3 className="text-white font-medium">
                            Pedido #ALF238763
                          </h3>
                          <p className="text-gray-400 text-sm">
                            AirPods Pro (x1)
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date().toLocaleDateString("pt-BR")} - Pix
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white font-medium">
                            R$ 1.999,00
                          </span>
                          <span className="text-green-400 text-sm">
                            Aprovado
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>
                          <h3 className="text-white font-medium">
                            Pedido #ALF238762
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Carregador MagSafe (x1)
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date().toLocaleDateString("pt-BR")} - Boleto
                          </p>
                        </div>
                        <div className="flex flex-col items-end">

                          <span className="text-white font-medium">
                            R$ 499,00
                          </span>
                          <span className="text-yellow-400 text-sm">
                            Pendente
                          </span>

                          <span className="text-white font-medium">R$ 499,00</span>
                          <span className="text-yellow-400 text-sm">Pendente</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs mt-1 h-6 px-2"
                          >
                            Verificar
                          </Button>
d7952de85cc29daa40d5d3636011b14b55a16e7f
                        </div>
                      </div>

                      <div className="flex justify-between p-4 bg-alphadark rounded-lg border border-gray-700">
                        <div>
                          <h3 className="text-white font-medium">
                            Pedido #ALF238761
                          </h3>
                          <p className="text-gray-400 text-sm">
                            iPhone 13 (x1)
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date().toLocaleDateString("pt-BR")} - WhatsApp
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white font-medium">
                            R$ 5.999,00
                          </span>
                          <span className="text-gray-400 text-sm">
                            Em processamento
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Configurações */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Configurações de Administrador
                    </CardTitle>
                    <CardDescription>
                      Gerencie as configurações de acesso administrativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email do Administrador</Label>
                      <div className="flex gap-2">
                        <Input
                          id="adminEmail"
                          value={newAdminEmail || adminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="admin@exemplo.com"
                        />
                        <Button
                          onClick={async () => {
                            if (!newAdminEmail || newAdminEmail === adminEmail)
                              return;
                            setIsUpdatingEmail(true);
                            setTimeout(() => {
                              setAdminEmail(newAdminEmail);
                              setNewAdminEmail("");
                              toast({
                                title: "Email atualizado",
                                description:
                                  "O email do administrador foi atualizado com sucesso.",
                              });
                              setIsUpdatingEmail(false);
                            }, 800);
                          }}
                          disabled={
                            !newAdminEmail ||
                            newAdminEmail === adminEmail ||
                            isUpdatingEmail
                          }
                          className="bg-alphablue hover:bg-alphablue/80"
                        >
                          {isUpdatingEmail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Atualizar"
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Este email será usado para login e recebimento de
                        códigos OTP
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          localStorage.removeItem("adminSession");
                          navigate("/login");
                        }}
                      >
                        Sair do Painel Admin
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Configurações de Webhook
                    </CardTitle>
                    <CardDescription>
                      Configure o webhook para receber notificações de pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">URL do Webhook</Label>
                      <Input
                        id="webhookUrl"
                        value={`${window.location.origin}/api/webhook`}
                        readOnly
                      />
                      <p className="text-xs text-gray-400">
                        Configure esta URL no seu gateway de pagamento
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookSecret">
                        Chave Secreta do Webhook
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="webhookSecret"
                          value={webhookSecret}
                          onChange={(e) => setWebhookSecret(e.target.value)}
                          placeholder="whsec_..."
                          type="password"
                        />
                        <Button
                          onClick={async () => {
                            if (!webhookSecret) return;
                            setIsUpdatingWebhook(true);
                            setTimeout(() => {
                              toast({
                                title: "Webhook atualizado",
                                description:
                                  "A chave secreta do webhook foi atualizada com sucesso.",
                              });
                              setIsUpdatingWebhook(false);
                            }, 800);
                          }}
                          disabled={!webhookSecret || isUpdatingWebhook}
                          className="bg-alphablue hover:bg-alphablue/80"
                        >
                          {isUpdatingWebhook ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Salvar"
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Esta chave é usada para verificar a autenticidade dos
                        webhooks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Métricas */}
            <TabsContent value="metrics">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cards de Resumo */}
                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Vendas
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-alphablue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metrics.totalSales.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      +12.3%
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Visualizações
                    </CardTitle>
                    <Users className="h-4 w-4 text-alphablue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metrics.totalVisits}
                    </div>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      +18.7%
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Conversão
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-alphablue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metrics.conversionRate}%
                    </div>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      +2.1%
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </CardContent>
                </Card>

                {/* Gráficos */}
                <Card className="lg:col-span-2 bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Visualizações por Página
                    </CardTitle>
                    <CardDescription>
                      Estatísticas de tráfego nas principais páginas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Página Inicial
                          </span>
                          <span className="text-sm text-white">
                            {metrics.pageViews.home}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-alphablue h-2.5 rounded-full"
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Produtos
                          </span>
                          <span className="text-sm text-white">
                            {metrics.pageViews.products}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-alphablue h-2.5 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Carrinho
                          </span>
                          <span className="text-sm text-white">
                            {metrics.pageViews.cart}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-alphablue h-2.5 rounded-full"
                            style={{ width: "14%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">
                            Checkout
                          </span>
                          <span className="text-sm text-white">
                            {metrics.pageViews.checkout}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-alphablue h-2.5 rounded-full"
                            style={{ width: "6%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Abandono de Carrinho
                    </CardTitle>
                    <CardDescription>
                      Taxa de abandono de carrinhos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-700 stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          ></circle>
                          <circle
                            className="text-red-400 stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${metrics.cartAbandonment * 2.51}, 251.2`}
                            strokeDashoffset="0"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            transform="rotate(-90 50 50)"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">
                            {metrics.cartAbandonment}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        {metrics.cartAbandonment}% dos usuários abandonam o
                        carrinho antes de finalizar a compra
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Aba de Configurações */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Configurações de Email</CardTitle>
                    <CardDescription>
                      Configure os emails administrativos e notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email do Administrador</Label>
                      <div className="flex items-center">
                        <div className="flex-grow flex items-center space-x-2 bg-alphadark rounded px-3 py-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{adminEmail}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">Alterar Email do Administrador</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="newEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="novo@email.com"
                        />
                        <Button 
                          onClick={updateAdminEmail} 
                          className="bg-alphablue hover:bg-alphablue/80 whitespace-nowrap"
                        >
                          Atualizar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <Label>Notificações por Email</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="email_orders" checked />
                            <label htmlFor="email_orders" className="text-white">Novos pedidos</label>
                          </div>
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="email_abandoned" checked />
                            <label htmlFor="email_abandoned" className="text-white">Carrinhos abandonados</label>
                          </div>
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b border-gray-700">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="email_payments" checked />
                            <label htmlFor="email_payments" className="text-white">Confirmações de pagamento</label>
                          </div>
                          <Button variant="ghost" size="sm">
                            Configurar
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start">
                      <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="text-yellow-500 font-medium">Envio de emails</h4>
                        <p className="text-yellow-500/80 text-sm">
                          Os emails são simulados em ambiente de desenvolvimento. Configure um serviço de email como Sendgrid ou Resend para envio real em produção.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-alphadarkblue border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Informações de Contato</CardTitle>
                    <CardDescription>
                      Configure as informações de contato exibidas no site
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Telefone de Contato</Label>
                      <Input 
                        id="contactPhone"
                        value="13 99611-4479"
                        className="font-medium"
                      />
                      <p className="text-xs text-gray-400">Este número será exibido no site e usado para o botão de WhatsApp</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de Contato</Label>
                      <Input 
                        id="contactEmail"
                        type="email"
                        value="loja.alphatechbr@gmail.com"
                        className="font-medium"
                      />
                      <p className="text-xs text-gray-400">Email exibido para clientes entrarem em contato</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsappMessage">Mensagem padrão do WhatsApp</Label>
                      <Textarea 
                        id="whatsappMessage"
                        value="Olá! Gostaria de saber mais sobre os produtos da Alpha Tech BR."
                        rows={3}
                      />
                      <p className="text-xs text-gray-400">Mensagem pré-configurada ao clicar no botão de WhatsApp</p>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-alphablue hover:bg-alphablue/80"
                    >
                      Salvar Alterações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
