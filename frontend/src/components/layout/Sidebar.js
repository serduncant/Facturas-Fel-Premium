import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, History, Settings, Crown, Shield, LogOut, Sun, Moon, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, darkMode, setDarkMode, onOpenPricing, invoiceCount = 0, invoiceLimit = 10 }) => {
    const { user, userData, logout } = useAuth();
    const { isAdmin } = useAdmin();
    const planName = userData?.plan === 'premium' ? 'Plan Premium' :
        userData?.plan === 'basic' ? 'Plan Básico' :
            userData?.plan === 'enterprise' ? 'Plan Enterprise' : 'Plan Gratuito';
    const isUnlimited = invoiceLimit === -1 || userData?.plan === 'premium' || userData?.plan === 'enterprise';
    const progressPercent = isUnlimited ? 100 : Math.min(100, Math.round((invoiceCount / invoiceLimit) * 100));
    const navItems = [
        {
            id: 'dashboard',
            label: 'Visualizador & Carga',
            icon: FileText,
            badge: null
        },
        {
            id: 'history',
            label: 'Historial Facturas',
            icon: History,
            badge: null
        },
        {
            id: 'settings',
            label: 'Personalizar Marca',
            icon: Settings,
            badge: null
        },
        {
            id: 'pricing',
            label: 'Planes & Pagos',
            icon: Crown,
            badge: userData?.plan === 'free' ? 'Upgrade' : null
        },
        ...(isAdmin ? [{
                id: 'admin',
                label: 'Panel Admin',
                icon: Shield,
                badge: 'Admin'
            }] : [])
    ];
    return (_jsxs("aside", { className: `
      relative flex flex-col h-screen transition-all duration-300 z-30 select-none
      ${collapsed ? 'w-20' : 'w-64'}
      bg-slate-900 border-r border-slate-800 text-slate-200 shadow-2xl
    `, children: [_jsxs("div", { className: "flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-950/40", children: [_jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [_jsxs("div", { className: "relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white font-extrabold text-lg shadow-lg shadow-blue-500/20 shrink-0", children: ["F", _jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" })] }), !collapsed && (_jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("span", { className: "font-extrabold text-base tracking-tight text-white font-sans", children: ["FEL", _jsx("span", { className: "text-blue-400 font-black", children: "PRO" })] }), _jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded", children: "GT" })] }), _jsx("span", { className: "text-[11px] text-slate-400 font-medium", children: "Visualizador FEL" })] }))] }), _jsx("button", { onClick: () => setCollapsed(!collapsed), className: "p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60", title: collapsed ? "Expandir menú" : "Colapsar menú", children: collapsed ? _jsx(ChevronRight, { className: "w-4 h-4" }) : _jsx(ChevronLeft, { className: "w-4 h-4" }) })] }), !collapsed && (_jsxs("div", { className: "mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/70 shadow-inner", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-slate-200", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-amber-400 fill-amber-400/20" }), _jsx("span", { children: planName })] }), userData?.plan === 'free' && (_jsxs("button", { onClick: onOpenPricing, className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1 shadow-sm", children: [_jsx(Sparkles, { className: "w-2.5 h-2.5" }), "PRO"] }))] }), _jsx("div", { className: "w-full bg-slate-700/60 rounded-full h-1.5 mb-1.5 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${progressPercent > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`, style: { width: `${progressPercent}%` } }) }), _jsxs("div", { className: "flex justify-between items-center text-[10px] text-slate-400", children: [_jsx("span", { children: "Uso mensual" }), _jsx("span", { className: "font-semibold text-slate-300", children: isUnlimited ? 'Ilimitado' : `${invoiceCount} / ${invoiceLimit} facturas` })] })] })), _jsx("nav", { className: "flex-1 px-3 py-2 space-y-1.5 overflow-y-auto", children: navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (_jsxs("button", { onClick: () => setActiveTab(item.id), className: `
                relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive
                            ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30 font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'}
              `, title: collapsed ? item.label : undefined, children: [_jsx(Icon, { className: `w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}` }), !collapsed && (_jsx("span", { className: "truncate flex-1 text-left", children: item.label })), !collapsed && item.badge && (_jsx("span", { className: `
                  text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${item.id === 'pricing'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}
                `, children: item.badge })), isActive && (_jsx("span", { className: "absolute right-0 top-2 bottom-2 w-1 bg-white rounded-l-full" }))] }, item.id));
                }) }), _jsxs("div", { className: "p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2", children: [_jsxs("button", { onClick: () => setDarkMode(!darkMode), className: "w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs border border-slate-700/40", children: [_jsxs("div", { className: "flex items-center gap-2", children: [darkMode ? _jsx(Sun, { className: "w-4 h-4 text-amber-400" }) : _jsx(Moon, { className: "w-4 h-4 text-indigo-400" }), !collapsed && _jsx("span", { children: darkMode ? 'Modo Claro' : 'Modo Oscuro' })] }), !collapsed && (_jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider font-semibold", children: darkMode ? 'ON' : 'OFF' }))] }), user ? (_jsxs("div", { className: "flex items-center justify-between pt-1", children: [_jsxs("div", { className: "flex items-center gap-2 overflow-hidden", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md", children: user.email?.[0].toUpperCase() || 'U' }), !collapsed && (_jsxs("div", { className: "flex flex-col truncate", children: [_jsx("span", { className: "text-xs font-semibold text-slate-200 truncate", children: userData?.displayName || user.email?.split('@')[0] }), _jsx("span", { className: "text-[10px] text-slate-400 truncate", children: user.email })] }))] }), _jsx("button", { onClick: logout, className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors", title: "Cerrar Sesi\u00F3n", children: _jsx(LogOut, { className: "w-4 h-4" }) })] })) : (!collapsed && (_jsx("div", { className: "text-center py-1", children: _jsx("span", { className: "text-xs text-slate-400", children: "Modo Invitado" }) })))] })] }));
};
