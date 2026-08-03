import React, { useState } from 'react';
import { X, Check, CreditCard, Building2 } from 'lucide-react';
import type { UserData } from '../../context/AuthContext';

interface Plan {
  id: 'free' | 'basic' | 'premium' | 'enterprise';
  name: string;
  price: number;
  priceAnnual: number;
  features: string[];
  popular?: boolean;
}

interface PricingModalProps {
  currentPlan: UserData['plan'];
  onClose: () => void;
  onSelectPayPal: (planId: string, isAnnual: boolean) => void;
  onSelectManual: (planId: string, isAnnual: boolean) => void;
  darkMode?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    priceAnnual: 0,
    features: [
      '10 facturas/mes',
      'Formatos básicos',
      'Con marca de agua',
      'Sin logo personalizado',
      'Soporte por email'
    ]
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 99,
    priceAnnual: 990,
    features: [
      '100 facturas/mes',
      'Todos los formatos',
      'Sin marca de agua',
      'Logo personalizado',
      'Historial ilimitado',
      'Exportar PDF/Excel/JSON',
      'Soporte prioritario'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    priceAnnual: 1990,
    features: [
      'Facturas ilimitadas',
      'Multi-usuario (3 usuarios)',
      'Todo del plan Básico',
      'Personalización avanzada',
      'API de integración',
      'Soporte 24/7'
    ]
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 499,
    priceAnnual: 4990,
    features: [
      'Todo ilimitado',
      'Multi-sucursales',
      'Usuarios ilimitados',
      'Instalación on-premise',
      'Reportes avanzados',
      'Soporte dedicado',
      'Capacitación incluida'
    ]
  }
];

export const PricingModal: React.FC<PricingModalProps> = ({
  currentPlan,
  onClose,
  onSelectPayPal,
  onSelectManual,
  darkMode = false
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlan(planId);
  };

  const handlePaymentMethod = (method: 'paypal' | 'transfer') => {
    if (!selectedPlan) return;

    
    if (method === 'paypal') {
      onSelectPayPal(selectedPlan, billingCycle === 'annual');
    } else {
      onSelectManual(selectedPlan, billingCycle === 'annual');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Elige tu Plan</h2>
              <p className="mt-2 text-blue-100">Escala tu negocio con las herramientas adecuadas</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Toggle Billing */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={billingCycle === 'monthly' ? 'font-bold' : 'text-blue-100'}>
              Mensual
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-green-500' : 'bg-white/30'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : ''
                }`}
              />
            </button>
            <span className={billingCycle === 'annual' ? 'font-bold' : 'text-blue-100'}>
              Anual <span className="text-xs">(2 meses gratis)</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-lg p-6 transition-all ${
                plan.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : darkMode
                  ? 'border-gray-700 hover:border-gray-600'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                selectedPlan === plan.id
                  ? 'ring-4 ring-blue-500 ring-opacity-50'
                  : ''
              } ${plan.id === currentPlan ? 'opacity-60' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              {plan.id === currentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    PLAN ACTUAL
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">
                    Q{billingCycle === 'annual' ? Math.round(plan.priceAnnual / 12) : plan.price}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    /mes
                  </span>
                </div>
                {billingCycle === 'annual' && plan.price > 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    Q{plan.priceAnnual} facturado anualmente
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.id === currentPlan || plan.id === 'free'}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  plan.id === currentPlan
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.id === currentPlan
                  ? 'Plan Actual'
                  : plan.id === 'free'
                  ? 'Plan Gratis'
                  : selectedPlan === plan.id
                  ? 'Seleccionado ✓'
                  : 'Seleccionar'}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        {selectedPlan && (
          <div className={`border-t p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Elige tu método de pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* PayPal */}
              <button
                onClick={() => handlePaymentMethod('paypal')}
                className={`p-6 border-2 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800 hover:border-blue-500'
                    : 'border-gray-200 bg-white hover:border-blue-500'
                }`}
              >
                <CreditCard size={40} className="text-blue-600 mx-auto mb-3" />
                <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  PayPal
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pago seguro con PayPal
                </p>
                <p className="text-xs text-green-600 mt-2">✓ Aprobación inmediata</p>
              </button>

              {/* Transferencia */}
              <button
                onClick={() => handlePaymentMethod('transfer')}
                className={`p-6 border-2 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'border-gray-700 bg-gray-800 hover:border-purple-500'
                    : 'border-gray-200 bg-white hover:border-purple-500'
                }`}
              >
                <Building2 size={40} className="text-purple-600 mx-auto mb-3" />
                <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transferencia/Depósito
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pago por transferencia bancaria
                </p>
                <p className="text-xs text-yellow-600 mt-2">⏱ Aprobación en 24-48h</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
