import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Loader2, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginProps {
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
  darkMode?: boolean;
}

export const Login: React.FC<LoginProps> = ({ 
  onSwitchToRegister, 
  onSwitchToReset,
  darkMode = false 
}) => {
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success('¡Bienvenido de nuevo!');
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast.error('Ocurrió un inconveniente. Iniciando en modo seguro local...');
      guestLogin('guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-3xl border shadow-2xl p-8`}>
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
          <LogIn className="h-7 w-7" />
        </div>
        <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Iniciar Sesión FEL PRO
        </h2>
        <p className={`mt-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Accede a tu cuenta de Visualizador FEL
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
            placeholder="tu@empresa.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-blue-600 hover:text-blue-500 font-semibold"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Iniciar Sesión
            </>
          )}
        </button>
      </form>

      {/* Botón de Acceso Instantáneo Demo */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            guestLogin('guest');
            toast.success('¡Bienvenido en Modo Demo!');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Probar como Usuario Demo (Gratis)</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 font-bold"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};
