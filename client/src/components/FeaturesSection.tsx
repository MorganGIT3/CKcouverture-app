import { Card, CardContent } from '@/components/ui/card';
import { Search, Camera, BarChart3 } from 'lucide-react';
import dashboardImage from '@assets/generated_images/Dashboard_interface_mockup_f808bffd.png';
import photoEnhancementImage from '@assets/generated_images/Photo_enhancement_comparison_c1eb7a8f.png';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-400" />,
      title: "Détection d'Opportunités",
      description: "Recherche automatique sur Leboncoin, SeLoger et autres plateformes. Filtrage intelligent par localisation, prix et critères personnalisés.",
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      icon: <Camera className="h-8 w-8 text-purple-400" />,
      title: "Amélioration Photos IA",
      description: "Module IA qui optimise automatiquement luminosité, contraste et netteté. Mode staging professionnel pour valoriser vos biens.",
      color: "from-purple-500/20 to-purple-600/20",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      title: "Dashboard Agence",
      description: "Tableau de bord centralisé pour suivre vos leads, analyser les performances et gérer votre portefeuille immobilier.",
      color: "from-green-500/20 to-green-600/20",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Fonctionnalités
            </span>{' '}
            <span className="text-foreground">Puissantes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tout ce dont votre agence a besoin pour automatiser la prospection et améliorer la présentation de vos biens.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate cursor-pointer group" data-testid={`card-feature-${index}`}>
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Interface Intuitive
            </h3>
            <p className="text-lg text-muted-foreground">
              Notre dashboard vous donne une vue d'ensemble complète de votre activité. 
              Suivez vos leads en temps réel, analysez les tendances du marché et optimisez vos performances.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Notifications en temps réel des nouveaux biens</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-muted-foreground">Traitement automatique des photos uploadées</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Analytics avancées et rapports personnalisés</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src={dashboardImage} 
              alt="Dashboard interface" 
              className="rounded-xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
          </div>
        </div>

        {/* Photo Enhancement Preview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mt-24">
          <div className="relative order-2 lg:order-1">
            <img 
              src={photoEnhancementImage} 
              alt="Photo enhancement comparison" 
              className="rounded-xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              IA d'Amélioration Photo
            </h3>
            <p className="text-lg text-muted-foreground">
              Transformez automatiquement vos photos de biens grâce à notre IA avancée. 
              Fini les photos sombres ou mal cadrées qui rebutent vos clients.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Correction automatique de l'exposition et des couleurs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-muted-foreground">Mode staging pour un rendu professionnel</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Traitement en moins de 30 secondes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}