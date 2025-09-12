import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import { 
  Building2, 
  Search, 
  Camera, 
  BarChart3, 
  ArrowLeft,
  Users,
  Euro,
  TrendingUp,
  Eye,
  Heart,
  Star,
  MapPin,
  Clock,
  Filter,
  Plus
} from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  // Mock data for charts
  const opportunityData = [
    { month: 'Jan', value: 45 },
    { month: 'Fév', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Avr', value: 67 },
    { month: 'Mai', value: 73 },
    { month: 'Jun', value: 81 },
  ];

  const revenueData = [
    { month: 'Jan', value: 125000 },
    { month: 'Fév', value: 142000 },
    { month: 'Mar', value: 138000 },
    { month: 'Avr', value: 165000 },
    { month: 'Mai', value: 178000 },
    { month: 'Jun', value: 195000 },
  ];

  const recentProperties = [
    {
      id: 1,
      title: "Villa Moderne - 4 Chambres",
      location: "Neuilly-sur-Seine",
      price: "€850,000",
      status: "Nouveau",
      views: 23,
      likes: 8,
      time: "Il y a 2h"
    },
    {
      id: 2,
      title: "Appartement Centre Ville",
      location: "16ème Arrondissement",
      price: "€425,000",
      status: "En cours",
      views: 45,
      likes: 12,
      time: "Il y a 4h"
    },
    {
      id: 3,
      title: "Maison Familiale avec Jardin",
      location: "Boulogne-Billancourt",
      price: "€670,000",
      status: "Vendu",
      views: 67,
      likes: 19,
      time: "Il y a 1j"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Accueil
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <p className="text-sm text-muted-foreground">Bonne journée, voici vos performances du jour</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-filter">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" data-testid="button-add">
                <Plus className="h-4 w-4" />
                Nouveau
              </Button>
              <Button variant="outline" size="sm" data-testid="button-logout">
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Revenus ce mois"
              value="€195,000"
              change="+12.5%"
              trend="up"
              subtitle="vs mois dernier"
              icon={<Euro className="h-5 w-5" />}
              gradient="from-green-500 to-emerald-600"
            />
            
            <MetricCard
              title="Nouvelles Opportunités"
              value="81"
              change="+8.2%"
              trend="up"
              subtitle="détectées cette semaine"
              icon={<Search className="h-5 w-5" />}
              gradient="from-blue-500 to-cyan-600"
            />
            
            <MetricCard
              title="Photos Traitées"
              value="247"
              change="+15.3%"
              trend="up"
              subtitle="améliorées par l'IA"
              icon={<Camera className="h-5 w-5" />}
              gradient="from-purple-500 to-pink-600"
            />
            
            <MetricCard
              title="Taux de Conversion"
              value="24.7%"
              change="+2.1%"
              trend="up"
              subtitle="leads → ventes"
              icon={<TrendingUp className="h-5 w-5" />}
              gradient="from-orange-500 to-red-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Opportunités Détectées"
              type="line"
              data={opportunityData}
              dataKey="value"
              xAxisKey="month"
              color="#6366f1"
              height={250}
            />
            
            <ChartCard
              title="Évolution des Revenus"
              type="bar"
              data={revenueData}
              dataKey="value"
              xAxisKey="month"
              color="#8b5cf6"
              height={250}
            />
          </div>

          {/* Recent Properties & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Properties */}
            <Card className="lg:col-span-2 hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Biens Récents
                </CardTitle>
                <Button variant="outline" size="sm" data-testid="button-view-all">
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-blue-50 to-purple-50/50 transition-all duration-200 hover-elevate cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{property.title}</h4>
                        <Badge 
                          variant={property.status === 'Nouveau' ? 'default' : property.status === 'Vendu' ? 'secondary' : 'outline'}
                          className={property.status === 'Nouveau' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {property.time}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {property.price}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {property.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {property.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Tier */}
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-white">A+</span>
                  </div>
                  <h3 className="font-semibold text-lg">Tier Elite</h3>
                  <p className="text-sm text-muted-foreground">Top 5% des agences</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Opportunités</span>
                    <span className="font-medium">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversions</span>
                    <span className="font-medium">209</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Score IA</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  13 points pour le niveau suivant
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}