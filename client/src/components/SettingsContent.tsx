"use client"

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChantiers, Client } from '@/context/ChantiersContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, Check, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsContent() {
  const { user } = useAuth();
  const { clients } = useChantiers();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les données du profil
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, email, phone, address, avatar_url, client_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          // Si le profil n'existe pas, utiliser les données de l'utilisateur
          setFullName(user.user_metadata?.full_name || '');
          setEmail(user.email || '');
        } else if (data) {
          setFullName(data.full_name || '');
          setEmail(data.email || user.email || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setSelectedClientId(data.client_id || '');
          if (data.avatar_url) {
            // Récupérer l'URL publique depuis Supabase Storage
            const { data: urlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            setAvatarUrl(urlData.publicUrl);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setFullName(user.user_metadata?.full_name || '');
        setEmail(user.email || '');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop grande (max 5MB)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        setError('Utilisateur non connecté');
        return;
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Uploader l'image vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        // Si le bucket n'existe pas, informer l'utilisateur
        if (uploadError.message.includes('Bucket') || uploadError.message.includes('not found')) {
          throw new Error('Le bucket de stockage "avatars" n\'existe pas. Veuillez le créer dans Supabase Storage.');
        }
        throw uploadError;
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec l'URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          avatar_url: filePath,
          full_name: fullName || null,
          email: email || user.email || null,
          phone: phone || null,
          address: address || null,
          client_id: selectedClientId || null,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(urlData.publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message || 'Erreur lors de l\'upload de l\'image');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: fullName || null,
          email: email || user.email || null,
          phone: phone || null,
          address: address || null,
          client_id: selectedClientId || null,
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    if (clientId) {
      const selectedClient = clients.find(c => c.id === clientId);
      if (selectedClient) {
        setFullName(selectedClient.name);
        setEmail(selectedClient.email);
        setPhone(selectedClient.phone);
      }
    }
  };

  if (loading && !fullName && !email) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Photo de profil */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-white/20">
            <AvatarImage src={avatarUrl || undefined} alt={fullName || 'Profil'} />
            <AvatarFallback className="bg-white/10 text-white text-2xl">
              {fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            {avatarUrl ? 'Changer la photo' : 'Ajouter une photo'}
          </Button>
          <p className="text-xs text-white/60">JPG, PNG ou WEBP (max 5MB)</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {/* Sélection de client existant */}
        <div className="space-y-2">
          <Label htmlFor="client" className="text-white">
            Sélectionner un client existant (optionnel)
          </Label>
          <Select value={selectedClientId || undefined} onValueChange={handleClientSelect}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choisir un client..." />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20 text-white">
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id} className="text-white">
                  {client.name} - {client.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedClientId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedClientId('');
                setFullName('');
                setPhone('');
              }}
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
            >
              Effacer la sélection
            </Button>
          )}
          <p className="text-xs text-white/60">
            Sélectionnez un client pour remplir automatiquement les informations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">
              Nom complet
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom complet"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              disabled
            />
            <p className="text-xs text-white/60">L'email ne peut pas être modifié</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Téléphone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">
              Adresse
            </Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Votre adresse"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {/* Messages d'erreur et succès */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 text-green-200 text-sm rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          Modifications enregistrées avec succès
        </div>
      )}

      {/* Bouton de sauvegarde */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enregistrement...
          </>
        ) : (
          'Enregistrer les modifications'
        )}
      </Button>
    </div>
  );
}

