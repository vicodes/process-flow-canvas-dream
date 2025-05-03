import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./hooks/use-toast";
import AppLayout from "./components/layout/AppLayout";
import ProcessList from "./pages/ProcessList";
import ProcessDetails from "./pages/ProcessDetails";
import ProcessModeler from "./pages/ProcessModeler";
import BpmnGenerator from "./pages/BpmnGenerator";
import DmnList from "./pages/DmnList";
import DmnDetails from "./pages/DmnDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<ProcessList />} />
                    <Route path="processes/:processId" element={<ProcessDetails />} />
                    <Route path="dmns" element={<DmnList />} />
                    <Route path="dmns/:dmnId" element={<DmnDetails />} />
                    <Route path="modeler" element={<ProcessModeler />} />
                    <Route path="generator" element={<BpmnGenerator />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
