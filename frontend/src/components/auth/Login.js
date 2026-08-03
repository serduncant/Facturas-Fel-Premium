import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
export const Login = ({ onSwitchToRegister, onSwitchToReset, darkMode = false }) => {
    const { login, guestLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Por favor completa todos los campos');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('¡Bienvenido de nuevo!');
        }
        catch (error) {
            console.error('Login error:', error);
            toast.error('Ocurrió un inconveniente. Iniciando en modo seguro local...');
            guestLogin('guest');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: `max-w-md mx-auto ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-3xl border shadow-2xl p-8`, children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4", children: _jsx(LogIn, { className: "h-7 w-7" }) }), _jsx("h2", { className: `text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`, children: "Iniciar Sesi\u00F3n FEL PRO" }), _jsx("p", { className: `mt-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`, children: "Accede a tu cuenta de Visualizador FEL" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: `block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`, children: "Correo electr\u00F3nico" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: `w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'}`, placeholder: "tu@empresa.com", disabled: loading })] }), _jsxs("div", { children: [_jsx("label", { className: `block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`, children: "Contrase\u00F1a" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: `w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading })] }), _jsx("div", { className: "flex items-center justify-between text-xs", children: _jsx("button", { type: "button", onClick: onSwitchToReset, className: "text-blue-600 hover:text-blue-500 font-semibold", children: "\u00BFOlvidaste tu contrase\u00F1a?" }) }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "animate-spin", size: 16 }), "Iniciando sesi\u00F3n..."] })) : (_jsxs(_Fragment, { children: [_jsx(LogIn, { size: 16 }), "Iniciar Sesi\u00F3n"] })) })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-slate-200 dark:border-slate-800", children: _jsxs("button", { type: "button", onClick: () => {
                        guestLogin('guest');
                        toast.success('¡Bienvenido en Modo Demo!');
                    }, className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-md", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: "Probar como Usuario Demo (Gratis)" })] }) }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: `text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`, children: ["\u00BFNo tienes cuenta?", ' ', _jsx("button", { onClick: onSwitchToRegister, className: "text-blue-600 hover:text-blue-500 font-bold", children: "Reg\u00EDstrate aqu\u00ED" })] }) })] }));
};
