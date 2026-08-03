import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterProps {
  onSwitchToLogin: () => void;
  darkMode?: boolean;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, darkMode = false }) => {
  const { register, guestLogin } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.displayName);
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: unknown) {
      console.error('Error al registrar:', error);
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
          <UserPlus className="h-7 w-7" />
        </div>
        <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Crear Cuenta FEL PRO
        </h2>
        <p className={`mt-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Comienza gratis con 10 facturas FEL al mes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
            Nombre completo
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            className={`w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
            placeholder="Ej: Juan Pérez"
            disabled={loading}
          />
        </div>

        <div>
          <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className={`w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div>
          <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-1.5`}>
            Confirmar contraseña
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className={`w-full px-4 py-2.5 text-xs font-medium border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Crear Cuenta Gratis
            </>
          )}
        </button>
      </form>

      {/* Botón de Acceso Instantáneo Demo */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          type="button"
          onClick={() => {
            guestLogin('guest');
            toast.success('¡Acceso Demo activado!');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Acceder Instantáneamente (Modo Demo)</span>
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 font-bold"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};
