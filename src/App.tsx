import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { useEffect } from "react";
import { TempoDevtools } from "tempo-devtools";
import { useRoutes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
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
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

// Initialize Tempo Devtools
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

const queryClient = new QueryClient();

// Route observer component to track navigation
const RouteObserver = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Navigation tracking is handled internally by Tempo
    // No need to manually report navigation
  }, [location, navigationType]);

  return null;
};

const AppRoutes = () => {
  // Import tempo routes if in Tempo environment
  let tempoRoutes = null;
  if (import.meta.env.VITE_TEMPO === "true") {
    try {
      // @ts-ignore - This import is dynamically available when running in Tempo
      tempoRoutes = useRoutes(window.__TEMPO_ROUTES__ || []);
    } catch (e) {
      console.warn("Failed to load Tempo routes:", e);
    }
  }

  return (
    <>
      {tempoRoutes}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/iphones" element={<IPhones />} />
        <Route path="/acessorios" element={<Acessorios />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/promocoes" element={<Promocoes />} />
        <Route path="/promo" element={<Promocoes />} />{" "}
        {/* Alias for /promocoes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        {/* Allow Tempo routes before the catch-all */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteObserver />
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
