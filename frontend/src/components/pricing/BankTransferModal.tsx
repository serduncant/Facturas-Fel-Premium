import React, { useState } from 'react';
import { X, Copy, Check, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface BankTransferModalProps {
  planName: string;
  amount: number;
  userId: string;
  userEmail: string;
  onClose: () => void;
  darkMode?: boolean;
}

export const BankTransferModal: React.FC<BankTransferModalProps> = ({
  planName,
  amount,
  userId,
  userEmail,
  onClose,
  darkMode = false
}) => {
  const [voucher, setVoucher] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Variables de entorno para datos bancarios
  const bankName = import.meta.env.VITE_BANK_NAME || 'Banco Industrial';
  const bankAccount = import.meta.env.VITE_BANK_ACCOUNT || '123-456789-0';
  const accountName = import.meta.env.VITE_ACCOUNT_NAME || 'FEL PRO Guatemala, S.A.';


  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleVoucherUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setVoucher(e.target?.result as string);
      toast.success('Comprobante cargado');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!voucher) {
      toast.error('Por favor sube tu comprobante de pago');
      return;
    }

    setUploading(true);

    try {
      // Guardar solicitud de upgrade en Firestore
      const upgradeRef = doc(db, 'upgrade_requests', `${userId}_${Date.now()}`);
      await setDoc(upgradeRef, {
        userId,
        userEmail,
        planRequested: planName,
        amount,
        paymentMethod: 'bank_transfer',
        voucher,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      toast.success('¡Solicitud enviada! Te confirmaremos en 24-48 horas', {
        duration: 5000
      });
      
      onClose();
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      toast.error('Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pago por Transferencia
              
            </h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Plan {planName} - Q{amount}
            </p>
            <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><strong>Banco:</strong> {bankName}</p>
              <p><strong>No. de cuenta:</strong> {bankAccount}</p>
              <p><strong>Nombre:</strong> {accountName}</p>
              <p><strong>Tipo:</strong> Monetaria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Instrucciones */}
        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
          <h4 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            📋 Instrucciones:
          </h4>
          <ol className={`text-sm space-y-1 list-decimal list-inside ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            <li>Realiza la transferencia a la cuenta indicada</li>
            <li>Sube tu comprobante de pago</li>
            <li>Espera la confirmación (24-48 horas)</li>
            <li>Tu plan será activado automáticamente</li>
          </ol>
        </div>

        {/* Datos Bancarios */}
        <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💳 Datos para Transferencia:
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Banco:</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {bankName}
                </span>
                <button
                  onClick={() => copyToClipboard(bankName, 'banco')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {copied === 'banco' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Número de Cuenta:</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-mono text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {bankAccount}
                </span>
                <button
                  onClick={() => copyToClipboard(bankAccount, 'cuenta')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {copied === 'cuenta' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>A nombre de:</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {accountName}
                </span>
                <button
                  onClick={() => copyToClipboard(accountName, 'nombre')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {copied === 'nombre' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tipo:</label>
              <p className={`font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Monetaria
              </p>
            </div>

            <div className="pt-3 border-t border-gray-300">
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monto a transferir:</label>
              <p className="text-2xl font-bold text-green-600">
                Q{amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Comprobante */}
        <div className="mb-6">
          <label className={`block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📎 Sube tu comprobante:
          </label>
          
          {!voucher ? (
            <label
              className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                darkMode
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <Upload
                className={`mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                size={40}
              />
              <span className={`block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Click para subir imagen del comprobante
              </span>
              <span className="block text-xs text-gray-500 mt-1">
                JPG, PNG (máx. 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleVoucherUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img src={voucher} alt="Comprobante" className="w-full rounded-lg border" />
              <button
                onClick={() => setVoucher(null)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Botón Enviar */}
        <button
          onClick={handleSubmit}
          disabled={!voucher || uploading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Revisaremos tu pago y activaremos tu plan en máximo 48 horas
        </p>
      </div>
    </div>
  );
};
