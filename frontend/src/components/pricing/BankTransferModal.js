import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Copy, Check, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
export const BankTransferModal = ({ planName, amount, userId, userEmail, onClose, darkMode = false }) => {
    const [voucher, setVoucher] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(null);
    // Variables de entorno para datos bancarios
    const bankName = import.meta.env.VITE_BANK_NAME || 'Banco Industrial';
    const bankAccount = import.meta.env.VITE_BANK_ACCOUNT || '123-456789-0';
    const accountName = import.meta.env.VITE_ACCOUNT_NAME || 'FEL PRO Guatemala, S.A.';
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        toast.success('Copiado al portapapeles');
        setTimeout(() => setCopied(null), 2000);
    };
    const handleVoucherUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setVoucher(e.target?.result);
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
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
            toast.error('Error al enviar la solicitud. Intenta nuevamente.');
        }
        finally {
            setUploading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto`, children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Pago por Transferencia" }), _jsxs("p", { className: `text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: ["Plan ", planName, " - Q", amount] }), _jsxs("div", { className: `mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: [_jsxs("p", { children: [_jsx("strong", { children: "Banco:" }), " ", bankName] }), _jsxs("p", { children: [_jsx("strong", { children: "No. de cuenta:" }), " ", bankAccount] }), _jsxs("p", { children: [_jsx("strong", { children: "Nombre:" }), " ", accountName] }), _jsxs("p", { children: [_jsx("strong", { children: "Tipo:" }), " Monetaria"] })] })] }), _jsx("button", { onClick: onClose, className: `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`, children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: `p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`, children: [_jsx("h4", { className: `font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`, children: "\uD83D\uDCCB Instrucciones:" }), _jsxs("ol", { className: `text-sm space-y-1 list-decimal list-inside ${darkMode ? 'text-blue-200' : 'text-blue-800'}`, children: [_jsx("li", { children: "Realiza la transferencia a la cuenta indicada" }), _jsx("li", { children: "Sube tu comprobante de pago" }), _jsx("li", { children: "Espera la confirmaci\u00F3n (24-48 horas)" }), _jsx("li", { children: "Tu plan ser\u00E1 activado autom\u00E1ticamente" })] })] }), _jsxs("div", { className: `p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`, children: [_jsx("h4", { className: `font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "\uD83D\uDCB3 Datos para Transferencia:" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Banco:" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: `font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`, children: bankName }), _jsx("button", { onClick: () => copyToClipboard(bankName, 'banco'), className: "p-1 hover:bg-gray-200 rounded", children: copied === 'banco' ? _jsx(Check, { size: 16, className: "text-green-500" }) : _jsx(Copy, { size: 16 }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "N\u00FAmero de Cuenta:" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: `font-mono text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: bankAccount }), _jsx("button", { onClick: () => copyToClipboard(bankAccount, 'cuenta'), className: "p-1 hover:bg-gray-200 rounded", children: copied === 'cuenta' ? _jsx(Check, { size: 16, className: "text-green-500" }) : _jsx(Copy, { size: 16 }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "A nombre de:" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: `font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`, children: accountName }), _jsx("button", { onClick: () => copyToClipboard(accountName, 'nombre'), className: "p-1 hover:bg-gray-200 rounded", children: copied === 'nombre' ? _jsx(Check, { size: 16, className: "text-green-500" }) : _jsx(Copy, { size: 16 }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Tipo:" }), _jsx("p", { className: `font-mono text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Monetaria" })] }), _jsxs("div", { className: "pt-3 border-t border-gray-300", children: [_jsx("label", { className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Monto a transferir:" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["Q", amount.toFixed(2)] })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: `block font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "\uD83D\uDCCE Sube tu comprobante:" }), !voucher ? (_jsxs("label", { className: `block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${darkMode
                                ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                                : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`, children: [_jsx(Upload, { className: `mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, size: 40 }), _jsx("span", { className: `block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: "Click para subir imagen del comprobante" }), _jsx("span", { className: "block text-xs text-gray-500 mt-1", children: "JPG, PNG (m\u00E1x. 5MB)" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => e.target.files?.[0] && handleVoucherUpload(e.target.files[0]), className: "hidden" })] })) : (_jsxs("div", { className: "relative", children: [_jsx("img", { src: voucher, alt: "Comprobante", className: "w-full rounded-lg border" }), _jsx("button", { onClick: () => setVoucher(null), className: "absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600", children: _jsx(X, { size: 16 }) })] }))] }), _jsx("button", { onClick: handleSubmit, disabled: !voucher || uploading, className: "w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: uploading ? 'Enviando...' : 'Enviar Solicitud' }), _jsx("p", { className: "text-xs text-center text-gray-500 mt-4", children: "Revisaremos tu pago y activaremos tu plan en m\u00E1ximo 48 horas" })] }) }));
};
