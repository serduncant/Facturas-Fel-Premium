import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { AVAILABLE_TEMPLATES, InvoiceTemplate } from '../../types/templates';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onSelectTemplate: (template: InvoiceTemplate) => void;
  userPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  darkMode?: boolean;
  format: 'ticket' | 'mediaCarta' | 'carta';
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
  userPlan,
  darkMode = false,
  format
}) => {
  const isPremium = userPlan === 'premium' || userPlan === 'enterprise';

  if (format === 'ticket') {
    return null;
  }

  const handleSelect = (templateId: InvoiceTemplate, isPremiumTemplate: boolean) => {
    if (isPremiumTemplate && !isPremium) {
      return;
    }
    onSelectTemplate(templateId);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {AVAILABLE_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isLocked = template.isPremium && !isPremium;
          
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id, template.isPremium)}
              disabled={isLocked}
              className={`
                relative p-3.5 rounded-xl border text-left transition-all duration-200 group
                ${isSelected
                  ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-md shadow-blue-500/10 ring-2 ring-blue-500/30'
                  : darkMode
                  ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{template.preview}</span>
                  <span className="text-xs font-bold">{template.name}</span>
                </div>

                {template.isPremium ? (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                    isLocked 
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                    PRO
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    GRATIS
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {template.description}
              </p>

              {/* Color accents indicators */}
              <div className="flex items-center gap-1 mt-2.5">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700" style={{ backgroundColor: template.colors.primary }} />
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700" style={{ backgroundColor: template.colors.secondary }} />
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700" style={{ backgroundColor: template.colors.accent }} />
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
