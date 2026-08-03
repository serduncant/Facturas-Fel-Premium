import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
export const PasswordReset = ({ onSwitchToLogin, darkMode = false }) => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Por favor ingresa tu email');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email);
            toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.');
            setTimeout(() => onSwitchToLogin(), 2000);
        }
        catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar email de recuperación');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: `max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`, children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Mail, { className: `mx-auto h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}` }), _jsx("h2", { className: `mt-4 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Recuperar Contrase\u00F1a" }), _jsx("p", { className: `mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Te enviaremos un email para restablecer tu contrase\u00F1a" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`, children: "Correo electr\u00F3nico" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300'}`, placeholder: "tu@email.com", disabled: loading })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin", size: 20 }), "Enviando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Mail, { size: 20 }), "Enviar Email"] })) })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { onClick: onSwitchToLogin, className: "text-sm text-blue-600 hover:text-blue-500", children: "\u2190 Volver al inicio de sesi\u00F3n" }) })] }));
};
