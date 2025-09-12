import { Button } from '@/components/ui/button';
import DisplayCards from './DisplayCards';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@assets/generated_images/Luxury_property_hero_image_594618bd.png';

export default function HeroSection() {
  const handleGetStarted = () => {
    console.log('Get started clicked'); // todo: remove mock functionality
  };

  const handleWatchDemo = () => {
    console.log('Watch demo clicked'); // todo: remove mock functionality
  };

  const propertyCards = [
    {
      icon: <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>,
      title: "Villa Moderne",
      description: "€850,000 • 4 chambres",
      date: "Détectée il y a 2h",
      titleClassName: "text-blue-400",
    },
    {
      icon: <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>,
      title: "Appartement Centre",
      description: "€320,000 • 3 chambres",
      date: "Détectée il y a 4h",
      titleClassName: "text-purple-400",
    },
    {
      icon: <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>,
      title: "Maison Familiale",
      description: "€450,000 • 5 chambres",
      date: "Détectée il y a 6h",
      titleClassName: "text-green-400",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury property" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="text-foreground">Détectez les</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  opportunités
                </span>{' '}
                <span className="text-foreground">immobilières</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Automatisez la recherche de biens, améliorez vos photos avec l'IA, 
                et développez votre portefeuille client plus rapidement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={handleGetStarted}
                data-testid="button-hero-cta"
              >
                Commencer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleWatchDemo}
                data-testid="button-watch-demo"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la Démo
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>15 jours d'essai gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Aucune carte requise</span>
              </div>
            </div>
          </div>

          {/* Right Content - DisplayCards */}
          <div className="flex justify-center lg:justify-end">
            <DisplayCards cards={propertyCards} />
          </div>
        </div>
      </div>
    </section>
  );
}