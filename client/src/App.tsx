import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import QuotesPage from "@/pages/QuotesPage";
import AIVisualizationPage from "@/pages/AIVisualizationPage";
import ProspectsPage from "@/pages/ProspectsPage";
import ProjectsPage from "@/pages/ProjectsPage";
import PlanningPage from "@/pages/PlanningPage";
import PaymentsPage from "@/pages/PaymentsPage";
import PortfolioPage from "@/pages/PortfolioPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/quotes" component={QuotesPage} />
      <Route path="/dashboard/ai-visualization" component={AIVisualizationPage} />
      <Route path="/dashboard/prospects" component={ProspectsPage} />
      <Route path="/dashboard/projects" component={ProjectsPage} />
      <Route path="/dashboard/planning" component={PlanningPage} />
      <Route path="/dashboard/payments" component={PaymentsPage} />
      <Route path="/dashboard/portfolio" component={PortfolioPage} />
      <Route path="/dashboard/analytics" component={AnalyticsPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
