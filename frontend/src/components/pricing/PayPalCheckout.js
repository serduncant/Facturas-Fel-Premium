import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
export const PayPalCheckout = ({ planName, amount, onSuccess, onCancel, darkMode = false }) => {
    const { user } = useAuth();
    const [processing, setProcessing] = useState(false);
    // Usar VITE_PAYPAL_CLIENT_ID o 'test' como fallback de pruebas de PayPal
    const paypalOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture"
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createOrder = (_data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: `Plan ${planName} - Visualizador FEL Guatemala`,
                    amount: {
                        currency_code: "USD",
                        value: amount.toFixed(2)
                    }
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onApprove = async (_data, actions) => {
        setProcessing(true);
        try {
            const order = await actions.order.capture();
            console.log('Pago exitoso:', order);
            if (!user) {
                throw new Error('Usuario no autenticado');
            }
            // Determinar el tier según el nombre del plan
            const tierMap = {
                'Free': 'free',
                'Basic': 'basic',
                'Pro': 'premium',
                'Max': 'enterprise'
            };
            const newTier = tierMap[planName] || 'premium';
            // Calcular el monto en Quetzales (aprox 1 USD = 7.8 GTQ)
            const amountGTQ = amount * 7.8;
            // Actualizar el plan del usuario en Firestore de forma segura con merge
            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, {
                    plan: newTier,
                    lastPaymentDate: new Date().toISOString(),
                    lastPaymentMethod: 'paypal',
                    lastPaymentId: order.id,
                }, { merge: true });
                // Guardar registro del pago en upgrade_requests
                await addDoc(collection(db, 'upgrade_requests'), {
                    userId: user.uid,
                    userEmail: user.email,
                    planRequested: newTier,
                    amount: amountGTQ,
                    amountUSD: amount,
                    paymentMethod: 'paypal',
                    paypalOrderId: order.id,
                    paypalPayerId: order.payer?.payer_id || '',
                    paypalPayerEmail: order.payer?.email_address || '',
                    status: 'approved',
                    createdAt: serverTimestamp(),
                    approvedAt: serverTimestamp(),
                });
            }
            catch (dbErr) {
                console.warn('Error al guardar registro en Firestore:', dbErr);
            }
            toast.success(`¡Pago procesado exitosamente! Plan ${planName} activado.`);
            onSuccess();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        catch (error) {
            console.error('Error al procesar el pago:', error);
            toast.error('Error al activar el plan. Contacta a soporte.');
        }
        finally {
            setProcessing(false);
        }
    };
    const onError = (err) => {
        console.error('Error en el pago:', err);
        toast.error('Error al cargar PayPal. Verifica la conexión o la llave Client ID.');
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6 shadow-2xl`, children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: `text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`, children: "Pago con PayPal" }), _jsxs("p", { className: `text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: ["Plan ", planName, " - $", amount, " USD (\u2248 Q", (amount * 7.8).toFixed(2), ")"] })] }), _jsx("button", { onClick: onCancel, className: "p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors", disabled: processing, children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "mb-4", children: _jsx("div", { className: `p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`, children: _jsx("p", { className: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`, children: "\u2139\uFE0F Selecciona la opci\u00F3n de PayPal para completar tu pago de forma segura. Tu plan se activar\u00E1 autom\u00E1ticamente." }) }) }), processing && (_jsx("div", { className: `mb-4 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`, children: _jsx("p", { className: `text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`, children: "\u23F3 Procesando pago y activando plan... Por favor espera." }) })), _jsx("div", { className: "min-h-[150px] flex flex-col justify-center", children: _jsx(PayPalScriptProvider, { options: paypalOptions, children: _jsx(PayPalButtons, { createOrder: createOrder, onApprove: onApprove, onError: onError, onCancel: () => {
                                toast.error('Pago cancelado');
                                onCancel();
                            }, disabled: processing, style: {
                                layout: 'vertical',
                                color: 'gold',
                                shape: 'rect',
                                label: 'paypal'
                            } }) }) }), _jsx("p", { className: "text-xs text-center text-gray-500 mt-4", children: "Transacci\u00F3n encriptada y procesada por PayPal Inc." })] }) }));
};
