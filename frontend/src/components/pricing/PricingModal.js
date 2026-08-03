import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Check, CreditCard, Building2 } from 'lucide-react';
const plans = [
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
export const PricingModal = ({ currentPlan, onClose, onSelectPayPal, onSelectManual, darkMode = false }) => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const handleSelectPlan = (planId) => {
        if (planId === 'free')
            return;
        setSelectedPlan(planId);
    };
    const handlePaymentMethod = (method) => {
        if (!selectedPlan)
            return;
        if (method === 'paypal') {
            onSelectPayPal(selectedPlan, billingCycle === 'annual');
        }
        else {
            onSelectManual(selectedPlan, billingCycle === 'annual');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto`, children: [_jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: "Elige tu Plan" }), _jsx("p", { className: "mt-2 text-blue-100", children: "Escala tu negocio con las herramientas adecuadas" })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-white/20 rounded-lg transition-colors", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-4", children: [_jsx("span", { className: billingCycle === 'monthly' ? 'font-bold' : 'text-blue-100', children: "Mensual" }), _jsx("button", { onClick: () => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly'), className: `relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'annual' ? 'bg-green-500' : 'bg-white/30'}`, children: _jsx("span", { className: `absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : ''}` }) }), _jsxs("span", { className: billingCycle === 'annual' ? 'font-bold' : 'text-blue-100', children: ["Anual ", _jsx("span", { className: "text-xs", children: "(2 meses gratis)" })] })] })] }), _jsx("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: plans.map((plan) => (_jsxs("div", { className: `relative border-2 rounded-lg p-6 transition-all ${plan.popular
                            ? 'border-blue-500 shadow-lg scale-105'
                            : darkMode
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'} ${selectedPlan === plan.id
                            ? 'ring-4 ring-blue-500 ring-opacity-50'
                            : ''} ${plan.id === currentPlan ? 'opacity-60' : ''}`, children: [plan.popular && (_jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: _jsx("span", { className: "bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: "M\u00C1S POPULAR" }) })), plan.id === currentPlan && (_jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: _jsx("span", { className: "bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: "PLAN ACTUAL" }) })), _jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: plan.name }), _jsxs("div", { className: "mt-4", children: [_jsxs("span", { className: "text-4xl font-bold text-blue-600", children: ["Q", billingCycle === 'annual' ? Math.round(plan.priceAnnual / 12) : plan.price] }), _jsx("span", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "/mes" })] }), billingCycle === 'annual' && plan.price > 0 && (_jsxs("p", { className: "text-xs text-green-600 mt-2", children: ["Q", plan.priceAnnual, " facturado anualmente"] }))] }), _jsx("ul", { className: "space-y-3 mb-6", children: plan.features.map((feature, idx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Check, { size: 20, className: "text-green-500 flex-shrink-0 mt-0.5" }), _jsx("span", { className: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: feature })] }, idx))) }), _jsx("button", { onClick: () => handleSelectPlan(plan.id), disabled: plan.id === currentPlan || plan.id === 'free', className: `w-full py-3 rounded-lg font-bold transition-colors ${plan.id === currentPlan
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : darkMode
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'} ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`, children: plan.id === currentPlan
                                    ? 'Plan Actual'
                                    : plan.id === 'free'
                                        ? 'Plan Gratis'
                                        : selectedPlan === plan.id
                                            ? 'Seleccionado ✓'
                                            : 'Seleccionar' })] }, plan.id))) }), selectedPlan && (_jsxs("div", { className: `border-t p-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`, children: [_jsx("h3", { className: `text-xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Elige tu m\u00E9todo de pago" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto", children: [_jsxs("button", { onClick: () => handlePaymentMethod('paypal'), className: `p-6 border-2 rounded-lg transition-all hover:scale-105 ${darkMode
                                        ? 'border-gray-700 bg-gray-800 hover:border-blue-500'
                                        : 'border-gray-200 bg-white hover:border-blue-500'}`, children: [_jsx(CreditCard, { size: 40, className: "text-blue-600 mx-auto mb-3" }), _jsx("h4", { className: `font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "PayPal" }), _jsx("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Pago seguro con PayPal" }), _jsx("p", { className: "text-xs text-green-600 mt-2", children: "\u2713 Aprobaci\u00F3n inmediata" })] }), _jsxs("button", { onClick: () => handlePaymentMethod('transfer'), className: `p-6 border-2 rounded-lg transition-all hover:scale-105 ${darkMode
                                        ? 'border-gray-700 bg-gray-800 hover:border-purple-500'
                                        : 'border-gray-200 bg-white hover:border-purple-500'}`, children: [_jsx(Building2, { size: 40, className: "text-purple-600 mx-auto mb-3" }), _jsx("h4", { className: `font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Transferencia/Dep\u00F3sito" }), _jsx("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Pago por transferencia bancaria" }), _jsx("p", { className: "text-xs text-yellow-600 mt-2", children: "\u23F1 Aprobaci\u00F3n en 24-48h" })] })] })] }))] }) }));
};
