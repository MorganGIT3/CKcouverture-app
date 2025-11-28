"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChantiers, Estimation } from '@/context/ChantiersContext';
import { Calendar, Trash2, RefreshCw, Building } from 'lucide-react';

interface HistoriqueEstimationsProps {
  onReuseEstimation: (estimation: Estimation) => void;
}

export function HistoriqueEstimations({ onReuseEstimation }: HistoriqueEstimationsProps) {
  const { estimations, clients, deleteEstimation } = useChantiers();
  const [filterClientId, setFilterClientId] = useState<string>('');

  const filteredEstimations = filterClientId
    ? estimations.filter(e => e.clientId === filterClientId)
    : estimations;

  const sortedEstimations = [...filteredEstimations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
        <CardHeader>
          <CardTitle>Historique des Estimations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={filterClientId || undefined} onValueChange={setFilterClientId}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Tous les clients" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20 text-white">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="text-white">
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterClientId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterClientId('')}
                className="bg-black/20 border-white/10 text-white hover:bg-white/10"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des estimations */}
      {sortedEstimations.length === 0 ? (
        <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-white">
          <CardContent className="py-12 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-white/50" />
            <p className="text-white/70">Aucune estimation dans l'historique</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEstimations.map((estimation) => (
            <Card
              key={estimation.id}
              className="bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{estimation.clientName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(estimation.date)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEstimation(estimation.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informations du chantier */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-white/70" />
                    <span className="text-white/70">Métier:</span>
                    <span className="text-white">{estimation.chantierInfo.metier}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/70">Surface:</span>
                    <span className="text-white ml-2">{estimation.chantierInfo.surface} m²</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/70">Localisation:</span>
                    <span className="text-white ml-2">{estimation.chantierInfo.localisation}</span>
                  </div>
                </div>

                {/* Résultats de l'analyse */}
                {estimation.analysisResults && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Coût total:</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                        {estimation.analysisResults.coutTotal} €
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Bénéfice:</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                        {estimation.analysisResults.benefice} €
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => onReuseEstimation(estimation)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réutiliser cette estimation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

