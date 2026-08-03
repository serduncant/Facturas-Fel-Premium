import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordResetProps {
  onSwitchToLogin: () => void;
  darkMode?: boolean;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ 
  onSwitchToLogin,
  darkMode = false 
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error: unknown) {
        console.error('Error:', error);
        toast.error('Error al enviar email de recuperación');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`}>
      <div className="text-center mb-8">
        <Mail className={`mx-auto h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`mt-4 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recuperar Contraseña
        </h2>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Te enviaremos un email para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            }`}
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Enviando...
            </>
          ) : (
            <>
              <Mail size={20} />
              Enviar Email
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};
