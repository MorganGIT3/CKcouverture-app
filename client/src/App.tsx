import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalBackground } from "@/components/GlobalBackground";
import { ChantiersProvider } from "@/context/ChantiersContext";
import { AnimatePresence, motion } from "framer-motion";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import QuotesPage from "@/pages/QuotesPage";
import AIVisualizationPage from "@/pages/AIVisualizationPage";
import ProspectsPage from "@/pages/ProspectsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import PlanningPage from "@/pages/PlanningPage";
import EstimationPage from "@/pages/EstimationPage";
import ClientsPage from "@/pages/ClientsPage";
import NotFound from "@/pages/not-found";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

function Router() {
  const [location] = useLocation();

  const getComponent = () => {
    switch (location) {
      case "/":
        return <Home />;
      case "/login":
        return <LoginPage />;
      case "/dashboard":
        return <Dashboard />;
      case "/dashboard/estimation":
        return <EstimationPage />;
      case "/dashboard/quotes":
        return <QuotesPage />;
      case "/dashboard/ai-visualization":
        return <AIVisualizationPage />;
      case "/dashboard/prospects":
        return <ProspectsPage />;
      case "/dashboard/projects":
        return <ProjectsPage />;
      case "/dashboard/clients":
        return <ClientsPage />;
      case "/dashboard/planning":
        return <PlanningPage />;
      default:
        return <NotFound />;
    }
  };

  // Pages without sidebar (Home, Login) get full page animation
  const isFullPage = location === "/" || location === "/login";

  if (isFullPage) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full h-full"
        >
          {getComponent()}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Pages with sidebar - animation handled in PageWrapper or Dashboard
  return <>{getComponent()}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChantiersProvider>
        <TooltipProvider>
          <GlobalBackground />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ChantiersProvider>
    </QueryClientProvider>
  );
}

export default App;
