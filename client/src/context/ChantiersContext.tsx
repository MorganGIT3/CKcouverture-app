import { createContext, useContext, useState, ReactNode } from 'react';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  preferences?: string; // Style préféré du client (moderne, traditionnel, etc.)
}

export interface Chantier {
  id: string;
  nom: string;
  clientId: string;
  clientName: string;
  dateDebut: string;
  duree: string;
  images: string[];
  statut: 'planifié' | 'en cours' | 'terminé';
  typeProjet?: string;
  description?: string;
  materiaux?: Array<{ nom: string; quantite: string; prix: number }>;
}

export interface Estimation {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  chantierInfo: {
    surface: string;
    materiaux: string;
    localisation: string;
    delai: string;
    metier: string;
  };
  images: string[];
  analysisResults: any;
}

interface ChantiersContextType {
  clients: Client[];
  chantiers: Chantier[];
  estimations: Estimation[];
  addClient: (client: Client) => void;
  addChantier: (chantier: Chantier) => void;
  updateChantier: (id: string, updates: Partial<Chantier>) => void;
  addEstimation: (estimation: Estimation) => void;
  getEstimationsByClient: (clientId: string) => Estimation[];
  getChantierById: (id: string) => Chantier | undefined;
  deleteEstimation: (id: string) => void;
}

const ChantiersContext = createContext<ChantiersContextType | undefined>(undefined);

export function ChantiersProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '06 12 34 56 78', address: '123 Rue de la République, Paris 75001', preferences: 'moderne' },
    { id: '2', name: 'Marie Martin', email: 'marie.martin@email.com', phone: '06 98 76 54 32', address: '45 Avenue des Champs, Lyon 69001', preferences: 'traditionnel' }
  ]);
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [estimations, setEstimations] = useState<Estimation[]>([]);

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const addChantier = (chantier: Chantier) => {
    setChantiers(prev => [...prev, chantier]);
  };

  const updateChantier = (id: string, updates: Partial<Chantier>) => {
    setChantiers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addEstimation = (estimation: Estimation) => {
    setEstimations(prev => [...prev, estimation]);
  };

  const getEstimationsByClient = (clientId: string): Estimation[] => {
    return estimations.filter(e => e.clientId === clientId);
  };

  const getChantierById = (id: string): Chantier | undefined => {
    return chantiers.find(c => c.id === id);
  };

  const deleteEstimation = (id: string) => {
    setEstimations(prev => prev.filter(e => e.id !== id));
  };

  return (
    <ChantiersContext.Provider value={{ 
      clients, 
      chantiers, 
      estimations,
      addClient, 
      addChantier, 
      updateChantier,
      addEstimation,
      getEstimationsByClient,
      getChantierById,
      deleteEstimation
    }}>
      {children}
    </ChantiersContext.Provider>
  );
}

export function useChantiers() {
  const context = useContext(ChantiersContext);
  if (context === undefined) {
    throw new Error('useChantiers must be used within a ChantiersProvider');
  }
  return context;
}

