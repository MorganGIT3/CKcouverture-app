import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverBody,
  PopoverFooter,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SettingsContent } from '@/components/SettingsContent';
import { 
  Home, 
  FileText, 
  Wand2, 
  User,
  Users,
  Calendar,
  Building,
  Calculator,
  Workflow,
  Menu,
  X,
  LogOut,
  UserCircle
} from 'lucide-react';

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  // Charger la photo de profil et le nom
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setFullName(data.full_name);
          if (data.avatar_url) {
            const { data: urlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            setAvatarUrl(urlData.publicUrl);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadProfile();

    // Écouter les changements dans la table user_profiles
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user?.id}`,
        },
        () => {
          loadProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const menuItems = [
    { icon: Home, label: 'Vue d\'ensemble', href: '/dashboard', active: location === '/dashboard' },
    { icon: Calculator, label: 'Estimation automatique', href: '/dashboard/estimation', active: location === '/dashboard/estimation' },
    { icon: Building, label: 'Mes Chantiers', href: '/dashboard/projects', active: location === '/dashboard/projects' },
    { icon: Calendar, label: 'Planning', href: '/dashboard/planning', active: location === '/dashboard/planning' },
    { icon: Workflow, label: 'CRM Pipeline', href: '/dashboard/crm', active: location === '/dashboard/crm' },
    { icon: FileText, label: 'Générateur de Devis', href: '/dashboard/quotes', active: location === '/dashboard/quotes' },
    { icon: Wand2, label: 'Visualisation IA', href: '/dashboard/ai-visualization', active: location === '/dashboard/ai-visualization' },
    { icon: Users, label: 'Équipe', href: '/dashboard/team', active: location === '/dashboard/team' },
    { icon: User, label: 'Clients', href: '/dashboard/clients', active: location === '/dashboard/clients' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col z-50",
        collapsed ? "rounded-r-3xl" : "rounded-r-3xl"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-white">CK-Couverture</span>
              <span className="text-xs text-white/70 italic">Construire pour durer</span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-full flex items-center bg-white/20 backdrop-blur-xl border border-white/10 justify-center cursor-pointer outline-none ring-0 hover:bg-white/30 transition-all duration-100 z-50",
              collapsed ? "w-10 h-10" : "w-10 h-10"
            )}
          >
            {collapsed ? (
              <Menu size={18} className="text-white" />
            ) : (
              <X size={18} className="text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {!collapsed && (
          <div className="text-xs font-medium text-white/60 uppercase tracking-wide mb-4">
            Navigation
          </div>
        )}
        
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full rounded-full flex items-center gap-3 h-12 text-white transition-all duration-200",
                collapsed ? "justify-center px-0" : "justify-start px-4",
                item.active 
                  ? "bg-white/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/30" 
                  : "bg-transparent hover:bg-white/10 border border-transparent"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.button>
          </Link>
        ))}
      </nav>

      {/* Account Button */}
      <div className="p-4 border-t border-white/10">
        <Popover>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full rounded-full flex items-center gap-3 h-12 text-white transition-all duration-200 bg-transparent hover:bg-white/10 border border-transparent",
                collapsed ? "justify-center px-0" : "justify-start px-4"
              )}
            >
              {avatarUrl ? (
                <Avatar className="h-5 w-5 flex-shrink-0">
                  <AvatarImage src={avatarUrl} alt={fullName || 'Profil'} />
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <UserCircle className="h-5 w-5 flex-shrink-0" />
              )}
              {!collapsed && (
                <span className="text-sm font-medium">Compte</span>
              )}
            </motion.button>
          </PopoverTrigger>
          <PopoverContent 
            className="bg-black/20 backdrop-blur-xl border border-white/10 text-white w-96 max-h-[80vh] overflow-y-auto"
            side="right"
            align="start"
            sideOffset={8}
          >
            <PopoverHeader>
              <PopoverTitle className="text-white">Paramètres</PopoverTitle>
              {user?.email && (
                <p className="text-white/70 text-sm mt-1">{user.email}</p>
              )}
            </PopoverHeader>
            <PopoverBody className="p-0">
              <SettingsContent />
            </PopoverBody>
            <PopoverFooter>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={async () => {
                  await signOut();
                  setLocation('/');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
}