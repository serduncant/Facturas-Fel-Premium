import React, { useState } from 'react';
import { Sidebar, ActiveTab } from './Sidebar';
import { 
  Upload, 
  Sparkles, 
  Search, 
  HelpCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  onOpenPricing: () => void;
  onNewXmlClick?: () => void;
  invoiceCount?: number;
  invoiceLimit?: number;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenPricing,
  onNewXmlClick,
  invoiceCount = 0,
  invoiceLimit = 10,
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { userData } = useAuth();

  return (
    <div className={`min-h-screen flex font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar - Oculto durante la impresión */}
      <div className="print:hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenPricing={onOpenPricing}
          invoiceCount={invoiceCount}
          invoiceLimit={invoiceLimit}
        />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Superior - Oculto durante la impresión */}
        <header className={`
          h-16 px-6 flex items-center justify-between border-b select-none transition-colors print:hidden
          ${darkMode ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}
        `}>
          {/* Section Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold tracking-tight capitalize flex items-center gap-2">
              {activeTab === 'dashboard' && (
                <>
                  <FileCheck className="w-5 h-5 text-blue-500" />
                  <span>Visualizador FEL Guatemala</span>
                </>
              )}
              {activeTab === 'history' && <span>Historial de Facturas</span>}
              {activeTab === 'settings' && <span>Configuración de Marca</span>}
              {activeTab === 'pricing' && <span>Planes y Suscripción</span>}
              {activeTab === 'admin' && <span>Panel Administrador</span>}
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              SAT FEL v1.3
            </span>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Upload Button */}
            {activeTab !== 'dashboard' && onNewXmlClick && (
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  onNewXmlClick();
                }}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Cargar XML FEL</span>
              </button>
            )}

            {/* Upgrade Banner Button */}
            {userData?.plan === 'free' && (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-transform hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white/30" />
                <span className="hidden md:inline">Obtener Plan PRO</span>
                <span className="md:hidden">PRO</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
