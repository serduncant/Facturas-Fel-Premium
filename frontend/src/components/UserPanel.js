import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Crown, Zap, CheckCircle } from 'lucide-react';
export const UserPanel = ({ userData, darkMode = false, onUpgradeClick }) => {
    const planConfig = {
        free: {
            label: 'Gratuito',
            color: 'bg-gray-500',
            gradient: 'from-gray-400 to-gray-600',
            icon: CheckCircle
        },
        basic: {
            label: 'Básico',
            color: 'bg-blue-500',
            gradient: 'from-blue-400 to-blue-600',
            icon: Zap
        },
        premium: {
            label: 'Premium',
            color: 'bg-purple-500',
            gradient: 'from-purple-400 to-purple-600',
            icon: Crown
        },
        enterprise: {
            label: 'Enterprise',
            color: 'bg-pink-500',
            gradient: 'from-pink-400 to-pink-600',
            icon: Crown
        }
    };
    const currentPlan = planConfig[userData.plan];
    const Icon = currentPlan.icon;
    // Calcular porcentaje de uso
    const usagePercentage = (userData.invoiceCount / userData.invoiceLimit) * 100;
    const isNearLimit = usagePercentage >= 80;
    const isAtLimit = userData.invoiceCount >= userData.invoiceLimit;
    // Color de la barra de progreso según el uso
    const getProgressGradient = () => {
        if (isAtLimit)
            return 'from-red-400 to-red-600';
        if (isNearLimit)
            return 'from-yellow-400 to-yellow-600';
        return 'from-green-400 to-green-600';
    };
    return (_jsx("div", { className: `rounded-lg p-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg`, children: _jsxs("div", { className: "flex flex-wrap gap-6 items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-3 rounded-full bg-gradient-to-br ${currentPlan.gradient}`, children: _jsx(Icon, { className: "text-white", size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Plan Actual" }), _jsx("p", { className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: currentPlan.label })] })] }), _jsxs("div", { className: "flex-1 min-w-[300px]", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("p", { className: `text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: "Facturas procesadas" }), _jsxs("p", { className: `text-sm font-bold ${isAtLimit ? 'text-red-500' :
                                        isNearLimit ? 'text-yellow-500' :
                                            darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: [userData.invoiceCount, " / ", userData.invoiceLimit === 999999 ? '∞' : userData.invoiceLimit] })] }), _jsx("div", { className: `w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`, children: _jsx("div", { className: `h-full bg-gradient-to-r ${getProgressGradient()} transition-all duration-500 ease-out`, style: { width: `${Math.min(usagePercentage, 100)}%` } }) }), isAtLimit && (_jsx("p", { className: "text-xs text-red-500 mt-2 font-semibold", children: "\u26A0\uFE0F Has alcanzado el l\u00EDmite de tu plan. Actualiza para continuar." })), isNearLimit && !isAtLimit && (_jsxs("p", { className: "text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-semibold", children: ["\u26A0\uFE0F Te quedan ", userData.invoiceLimit - userData.invoiceCount, " facturas"] })), !isNearLimit && userData.plan === 'free' && (_jsx("p", { className: `text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`, children: "\uD83D\uDCA1 Actualiza tu plan para procesar m\u00E1s facturas" }))] }), userData.plan !== 'enterprise' && (_jsx("button", { onClick: onUpgradeClick, className: `px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isAtLimit
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'} shadow-lg hover:shadow-xl transform hover:scale-105`, children: isAtLimit ? '🚀 Actualizar Ahora' : '⬆️ Mejorar Plan' })), userData.plan === 'enterprise' && (_jsx("div", { className: `px-6 py-3 rounded-lg ${darkMode ? 'bg-pink-900/20 border border-pink-700' : 'bg-pink-50 border border-pink-200'}`, children: _jsxs("p", { className: "text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-2", children: [_jsx(Crown, { size: 20 }), "Plan M\u00E1ximo Activo"] }) }))] }) }));
};
