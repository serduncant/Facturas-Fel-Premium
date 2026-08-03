import React from 'react';
import { 
  FileText, 
  History, 
  Settings, 
  Crown, 
  Shield, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';

export type ActiveTab = 'dashboard' | 'history' | 'settings' | 'pricing' | 'admin';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onOpenPricing: () => void;
  invoiceCount?: number;
  invoiceLimit?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
  onOpenPricing,
  invoiceCount = 0,
  invoiceLimit = 10
}) => {
  const { user, userData, logout } = useAuth();
  const { isAdmin } = useAdmin();

  const planName = userData?.plan === 'premium' ? 'Plan Premium' : 
                   userData?.plan === 'basic' ? 'Plan Básico' : 
                   userData?.plan === 'enterprise' ? 'Plan Enterprise' : 'Plan Gratuito';

  const isUnlimited = invoiceLimit === -1 || userData?.plan === 'premium' || userData?.plan === 'enterprise';
  const progressPercent = isUnlimited ? 100 : Math.min(100, Math.round((invoiceCount / invoiceLimit) * 100));

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Visualizador & Carga',
      icon: FileText,
      badge: null
    },
    {
      id: 'history' as ActiveTab,
      label: 'Historial Facturas',
      icon: History,
      badge: null
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Personalizar Marca',
      icon: Settings,
      badge: null
    },
    {
      id: 'pricing' as ActiveTab,
      label: 'Planes & Pagos',
      icon: Crown,
      badge: userData?.plan === 'free' ? 'Upgrade' : null
    },
    ...(isAdmin ? [{
      id: 'admin' as ActiveTab,
      label: 'Panel Admin',
      icon: Shield,
      badge: 'Admin'
    }] : [])
  ];

  return (
    <aside className={`
      relative flex flex-col h-screen transition-all duration-300 z-30 select-none
      ${collapsed ? 'w-20' : 'w-64'}
      bg-slate-900 border-r border-slate-800 text-slate-200 shadow-2xl
    `}>
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white font-extrabold text-lg shadow-lg shadow-blue-500/20 shrink-0">
            F
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  FEL<span className="text-blue-400 font-black">PRO</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  GT
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Visualizador FEL</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Plan Widget in Sidebar */}
      {!collapsed && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/70 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>{planName}</span>
            </div>
            {userData?.plan === 'free' && (
              <button 
                onClick={onOpenPricing}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-2.5 h-2.5" />
                PRO
              </button>
            )}
          </div>

          <div className="w-full bg-slate-700/60 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>Uso mensual</span>
            <span className="font-semibold text-slate-300">
              {isUnlimited ? 'Ilimitado' : `${invoiceCount} / ${invoiceLimit} facturas`}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
              
              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className={`
                  text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${item.id === 'pricing' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}
                `}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Dark Mode */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs border border-slate-700/40"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            {!collapsed && <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>}
          </div>
          {!collapsed && (
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          )}
        </button>

        {/* User Card & Logout */}
        {user ? (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {userData?.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          !collapsed && (
            <div className="text-center py-1">
              <span className="text-xs text-slate-400">Modo Invitado</span>
            </div>
          )
        )}
      </div>
    </aside>
  );
};
