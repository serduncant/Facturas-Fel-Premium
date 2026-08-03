import React, { useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  RotateCcw,
  Palette,
  Layout,
  DollarSign,
  TrendingUp,
  Files,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { Invoice } from '../../types/invoice';
import type { InvoiceTemplate } from '../../types/templates';
import { FileUpload } from '../invoice/FileUpload';
import { FormatSelector } from '../invoice/FormatSelector';
import { TemplateSelector } from '../invoice/TemplateSelector';
import { InvoicePreview } from '../invoice/InvoicePreview';
import { Watermark } from '../Watermark';
import { motion } from 'framer-motion';

interface InvoiceDashboardProps {
  invoice: Invoice | null;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  format: 'ticket' | 'mediaCarta' | 'carta';
  setFormat: (format: 'ticket' | 'mediaCarta' | 'carta') => void;
  selectedTemplate: InvoiceTemplate;
  setSelectedTemplate: (template: InvoiceTemplate) => void;
  headerColor: string;
  setHeaderColor: (color: string) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  footerText: string;
  setFooterText: (text: string) => void;
  invoiceHistory: Invoice[];
  onClearCurrentInvoice: () => void;
  invoiceRef: React.RefObject<HTMLDivElement | null>;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportJSON: () => void;
  darkMode: boolean;
  userPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  showWatermark?: boolean;
  onOpenPricing?: () => void;
}

export const InvoiceDashboard: React.FC<InvoiceDashboardProps> = ({
  invoice,
  onFileUpload,
  isLoading,
  format,
  setFormat,
  selectedTemplate,
  setSelectedTemplate,
  headerColor,
  setHeaderColor,
  logo,
  setLogo,
  footerText,
  setFooterText,
  invoiceHistory,
  onClearCurrentInvoice,
  invoiceRef,
  onExportPDF,
  onExportExcel,
  onExportJSON,
  darkMode,
  userPlan = 'free',
  showWatermark = false,
  onOpenPricing
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isFreePlan = userPlan === 'free';

  // Calcular métricas del historial
  const totalInvoicesCount = invoiceHistory.length + (invoice ? 1 : 0);
  const totalAmountGTQ = invoiceHistory.reduce((acc, curr) => acc + (curr.total || 0), 0) + (invoice?.total || 0);
  const avgAmount = totalInvoicesCount > 0 ? (totalAmountGTQ / totalInvoicesCount) : 0;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFreePlan) {
      if (onOpenPricing) onOpenPricing();
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Metrics Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facturas Totales</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Files className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight">{totalInvoicesCount}</span>
            <span className="text-xs text-slate-400 font-medium">procesadas</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monto Total FEL</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-black text-sm">
              Q.
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Q.</span>
            <span className="text-2xl font-black tracking-tight">
              {totalAmountGTQ.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket Promedio</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Q.</span>
            <span className="text-2xl font-black tracking-tight">
              {avgAmount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Formato Impresión</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Layout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold capitalize">
              {format === 'carta' ? 'Carta Full (8.5" x 11")' : format === 'mediaCarta' ? 'Media Carta (5.5" x 8.5")' : 'POS Ticket (80mm)'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Section: If No Invoice Loaded, Show Hero Dropzone */}
      {!invoice ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 md:p-12 rounded-3xl border text-center relative overflow-hidden shadow-xl ${
            darkMode 
              ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-slate-800' 
              : 'bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/20 border-slate-200/80 shadow-slate-200/50'
          }`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Procesador Inteligente SAT Guatemala</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Carga tu factura electrónica <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">FEL XML</span>
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Arrastra y suelta tu archivo <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">.xml</code> emitido por la SAT para generar automáticamente la representación gráfica en PDF, exportar a Excel o imprimir en Ticket.
            </p>

            <div className="pt-2">
              <FileUpload
                accept={{ 'text/xml': ['.xml'], 'application/xml': ['.xml'] }}
                onFileUpload={onFileUpload}
                label="Haz clic para seleccionar o arrastra tu XML aquí"
                darkMode={darkMode}
                isLoading={isLoading}
              />
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Formatos SAT V1.3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Generación de QR y UUID</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Seguro y Privado</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Split Workspace when Invoice is Loaded */
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Controls & Customizations */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Exportar & Imprimir</span>
                </h3>
                <button
                  onClick={onClearCurrentInvoice}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                  title="Cargar otra factura"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nueva Factura</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={onExportPDF}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Pro</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>

                <button
                  onClick={onExportExcel}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={onExportJSON}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>JSON</span>
                </button>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-5 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="font-bold text-base flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>Estilo & Formato</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Tamaño de Documento
                </label>
                <FormatSelector format={format} onFormatChange={setFormat} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Plantilla de Diseño
                </label>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onSelectTemplate={setSelectedTemplate}
                  userPlan={userPlan}
                  format={format}
                  darkMode={darkMode}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Color Primario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-semibold uppercase">{headerColor}</span>
                </div>
              </div>

              {/* Logo de la Empresa (Restringido para Plan Gratuito) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Logo de la Empresa
                  </label>
                  {isFreePlan && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </div>

                {isFreePlan ? (
                  <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      🔒 El logo personalizado es exclusivo de planes PRO y Enterprise.
                    </p>
                    {onOpenPricing && (
                      <button
                        type="button"
                        onClick={onOpenPricing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-transform hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Desbloquear Logo PRO</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                      <span>{logo ? 'Cambiar Logo' : 'Subir Logo'}</span>
                    </button>
                    {logo && (
                      <button
                        onClick={() => setLogo(null)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Quitar Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Mensaje al Pie
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    darkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                  }`}
                  placeholder="¡Gracias por su compra!"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Invoice Preview */}
          <div className="lg:col-span-8 overflow-x-auto flex justify-center">
            <div className="relative shadow-2xl rounded-2xl bg-white text-slate-900 print:shadow-none print:m-0">
              <Watermark show={showWatermark}>
                <div ref={invoiceRef} className="p-4 sm:p-8">
                  <InvoicePreview
                    invoice={invoice}
                    logo={!isFreePlan ? (logo || undefined) : undefined}
                    format={format}
                    footerText={footerText}
                    borderColor={headerColor}
                    headerColor={headerColor}
                    template={selectedTemplate}
                  />
                </div>
              </Watermark>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
