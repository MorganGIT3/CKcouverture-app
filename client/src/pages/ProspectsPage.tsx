import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ProspectsPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des Prospects
                </h1>
                <p className="text-sm text-muted-foreground">CRM intégré pour suivre vos leads</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md text-center hover-elevate">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-xl">CRM Bientôt Disponible</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Le module de gestion des prospects arrive prochainement ! Gérez vos leads, 
                suivez vos rendez-vous et transformez vos contacts en clients.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Suivi des leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Calendrier RDV</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Historique client</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}