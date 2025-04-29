
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Support from "./pages/Support";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import IPhones from "./pages/iPhones";
import Acessorios from "./pages/Acessorios";
import Cart from "./pages/Cart";
import Produtos from "./pages/Produtos";
import Promocoes from "./pages/Promocoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/iphones" element={<IPhones />} />
          <Route path="/acessorios" element={<Acessorios />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/promocoes" element={<Promocoes />} />
          <Route path="/promo" element={<Promocoes />} /> {/* Alias for /promocoes */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
