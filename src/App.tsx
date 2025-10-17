import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParkingProvider } from "./contexts/ParkingContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Manager from "./pages/Manager";
import UserAuth from "./pages/UserAuth";
import ManagerAuth from "./pages/ManagerAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper for users
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

// Protected route wrapper for managers
const ProtectedManagerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/manager/auth" />;
  if (role !== 'manager') return <Navigate to="/" />;
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ParkingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<UserAuth />} />
              <Route path="/manager/auth" element={<ManagerAuth />} />
              <Route
                path="/"
                element={
                  <ProtectedUserRoute>
                    <Index />
                  </ProtectedUserRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedManagerRoute>
                    <Manager />
                  </ProtectedManagerRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ParkingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
