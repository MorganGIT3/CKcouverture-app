import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Home, 
  Search, 
  Camera, 
  BarChart3, 
  Users, 
  Settings, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Upload,
  Target
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const menuItems = [
    { icon: Home, label: 'Vue d\'ensemble', path: '/dashboard', active: location === '/dashboard' },
    { icon: Search, label: 'Opportunités', path: '/dashboard/opportunities', active: location === '/dashboard/opportunities' },
    { icon: Camera, label: 'Photos IA', path: '/dashboard/photos', active: location === '/dashboard/photos' },
    { icon: Building2, label: 'Mes Biens', path: '/dashboard/properties', active: location === '/dashboard/properties' },
    { icon: Users, label: 'Leads', path: '/dashboard/leads', active: location === '/dashboard/leads' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', active: location === '/dashboard/analytics' },
  ];

  const quickActions = [
    { icon: Upload, label: 'Upload Photo', action: () => console.log('Upload photo') },
    { icon: Target, label: 'Nouvelle Recherche', action: () => console.log('New search') },
    { icon: Bell, label: 'Alertes', action: () => console.log('Alerts') },
  ];

  return (
    <div className={cn(
      "h-screen bg-gradient-to-b from-slate-50 to-white border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">AgentPro</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
            data-testid="button-sidebar-toggle"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {!collapsed && (
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Navigation
          </div>
        )}
        
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed && "justify-center",
                item.active && "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              )}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}

        {!collapsed && (
          <>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-8 mb-4">
              Actions Rapides
            </div>
            
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-3 h-9"
                onClick={action.action}
                data-testid={`quick-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
              </Button>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link href="/dashboard/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10",
              collapsed && "justify-center"
            )}
            data-testid="nav-settings"
          >
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Paramètres</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
}