import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { parseXML } from './utils/xmlParser';
import { generatePDF } from './utils/pdfGenerator';
import { saveInvoice, getInvoices } from './utils/storage';
import { exportToJSON, exportToExcel } from './utils/exporters';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { useAdmin } from './hooks/useAdmin';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { PasswordReset } from './components/auth/PasswordReset';
import { incrementInvoiceCount, canProcessInvoice } from './hooks/useInvoiceCounter';
import { MainLayout } from './components/layout/MainLayout';
import { InvoiceDashboard } from './components/dashboard/InvoiceDashboard';
import { InvoiceHistory } from './components/invoice/InvoiceHistory';
import { PricingModal } from './components/pricing/PricingModal';
import { PayPalCheckout } from './components/pricing/PayPalCheckout';
import { BankTransferModal } from './components/pricing/BankTransferModal';
import UploadPaymentProof from './components/UploadPaymentProof';
import { AdminPanel } from './components/admin/AdminPanel';
import { Settings } from './components/Settings';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { Sun, Moon } from 'lucide-react';
function App() {
    const [invoice, setInvoice] = useState(null);
    const [logo, setLogo] = useState(null);
    const [format, setFormat] = useState('carta');
    const [footerText, setFooterText] = useState('¡Gracias por su compra!');
    const [error, setError] = useState(null);
    const [borderColor, setBorderColor] = useState('#000000');
    const [headerColor, setHeaderColor] = useState('#1e40af');
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [authView, setAuthView] = useState('login');
    const invoiceRef = useRef(null);
    const { user, userData, logout, setUserData } = useAuth();
    const { isAdmin } = useAdmin();
    const [selectedTemplate, setSelectedTemplate] = useState('clasica');
    const [showPricing, setShowPricing] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);
    const [showBankTransfer, setShowBankTransfer] = useState(false);
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
    useEffect(() => {
        loadInvoiceHistory();
        const savedLogo = localStorage.getItem('invoice-logo');
        if (savedLogo)
            setLogo(savedLogo);
        const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        if (userData && userData.invoiceCount >= userData.invoiceLimit * 0.9 && userData.plan === 'free') {
            toast(`⚠️ Te quedan ${userData.invoiceLimit - userData.invoiceCount} facturas en tu plan gratuito`, {
                duration: 5000,
                icon: '⚠️'
            });
        }
    }, [userData]);
    const loadInvoiceHistory = () => {
        const history = getInvoices();
        setInvoiceHistory(history);
    };
    const handleXMLUpload = async (file) => {
        if (userData && !canProcessInvoice(userData.invoiceCount, userData.invoiceLimit)) {
            setShowPricing(true);
            toast.error(`🚫 Límite alcanzado: ${userData.invoiceLimit} facturas en tu plan ${userData.plan.toUpperCase()}`, { duration: 6000, icon: '⚠️' });
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const text = await file.text();
            const parsedInvoice = await parseXML(text);
            setInvoice(parsedInvoice);
            saveInvoice(parsedInvoice);
            loadInvoiceHistory();
            if (user && userData) {
                await incrementInvoiceCount(user.uid);
                setUserData({
                    ...userData,
                    invoiceCount: userData.invoiceCount + 1
                });
            }
            toast.success('Factura FEL cargada exitosamente');
        }
        catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido al procesar el XML';
            setError(errorMsg);
            setInvoice(null);
            toast.error(errorMsg);
        }
        finally {
            setIsLoading(false);
        }
    };
    const toggleDarkMode = (mode) => {
        const nextMode = mode !== undefined ? mode : !darkMode;
        setDarkMode(nextMode);
        localStorage.setItem('dark-mode', String(nextMode));
        if (nextMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    };
    const handleSavePDF = () => {
        if (invoiceRef.current && invoice) {
            generatePDF(invoiceRef.current, invoice, format);
            toast.success('PDF generado exitosamente');
        }
    };
    const handleExportJSON = () => {
        if (invoice) {
            exportToJSON(invoice);
            toast.success('JSON exportado exitosamente');
        }
    };
    const handleExportExcel = () => {
        if (invoice) {
            exportToExcel(invoice);
            toast.success('Excel exportado exitosamente');
        }
    };
    const handleLoadFromHistory = (selectedInvoice) => {
        setInvoice(selectedInvoice);
        setActiveTab('dashboard');
        toast.success('Factura cargada desde historial');
    };
    const handleSelectPayPal = (planId, isAnnual) => {
        const planPrices = {
            basic: isAnnual ? 990 : 99,
            premium: isAnnual ? 1990 : 199,
            enterprise: isAnnual ? 4990 : 499
        };
        const planNames = {
            basic: 'Básico',
            premium: 'Premium',
            enterprise: 'Empresarial'
        };
        const amount = planPrices[planId];
        const amountUSD = Math.round(amount / 7.8);
        setSelectedPlanForPayment({
            id: planId,
            name: planNames[planId],
            amount: amountUSD
        });
        setShowPricing(false);
        setShowPayPal(true);
    };
    const handleSelectManual = (planId, isAnnual) => {
        const planPrices = {
            basic: isAnnual ? 990 : 99,
            premium: isAnnual ? 1990 : 199,
            enterprise: isAnnual ? 4990 : 499
        };
        const planNames = {
            basic: 'Básico',
            premium: 'Premium',
            enterprise: 'Empresarial'
        };
        setSelectedPlanForPayment({
            id: planId,
            name: planNames[planId],
            amount: planPrices[planId]
        });
        setShowPricing(false);
        setShowBankTransfer(true);
    };
    const handlePaymentSuccess = async () => {
        if (!user || !selectedPlanForPayment)
            return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                plan: selectedPlanForPayment.id,
                invoiceLimit: selectedPlanForPayment.id === 'basic' ? 100 : 999999,
                upgradedAt: new Date().toISOString()
            });
            if (userData) {
                setUserData({
                    ...userData,
                    plan: selectedPlanForPayment.id,
                    invoiceLimit: selectedPlanForPayment.id === 'basic' ? 100 : 999999
                });
            }
            toast.success(`¡Plan ${selectedPlanForPayment.name} activado exitosamente!`, { duration: 5000 });
            setShowPayPal(false);
            setShowBankTransfer(false);
            setSelectedPlanForPayment(null);
        }
        catch (error) {
            console.error('Error al actualizar plan:', error);
            toast.error('Error al activar el plan. Contacta soporte.');
        }
    };
    // Si no hay usuario autenticado, mostrar pantalla de Auth moderna
    if (!user) {
        return (_jsxs("div", { className: `min-h-screen flex items-center justify-center p-6 relative transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`, children: [_jsx(Toaster, { position: "top-right" }), _jsx("div", { className: "absolute top-6 right-6", children: _jsx("button", { onClick: () => toggleDarkMode(), className: `p-2.5 rounded-xl border transition-colors ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-indigo-600 shadow-sm'}`, children: darkMode ? _jsx(Sun, { size: 18 }) : _jsx(Moon, { size: 18 }) }) }), _jsxs("div", { className: "w-full max-w-md", children: [authView === 'login' && (_jsx(Login, { onSwitchToRegister: () => setAuthView('register'), onSwitchToReset: () => setAuthView('reset'), darkMode: darkMode })), authView === 'register' && (_jsx(Register, { onSwitchToLogin: () => setAuthView('login'), darkMode: darkMode })), authView === 'reset' && (_jsx(PasswordReset, { onSwitchToLogin: () => setAuthView('login'), darkMode: darkMode }))] })] }));
    }
    // Usuario Autenticado - Render con MainLayout y Tabs
    return (_jsxs(MainLayout, { activeTab: activeTab, setActiveTab: setActiveTab, darkMode: darkMode, setDarkMode: toggleDarkMode, onOpenPricing: () => setShowPricing(true), onNewXmlClick: () => setInvoice(null), invoiceCount: userData?.invoiceCount || 0, invoiceLimit: userData?.invoiceLimit || 10, children: [_jsx(Toaster, { position: "top-right" }), activeTab === 'dashboard' && (_jsx(InvoiceDashboard, { invoice: invoice, onFileUpload: handleXMLUpload, isLoading: isLoading, format: format, setFormat: setFormat, selectedTemplate: selectedTemplate, setSelectedTemplate: setSelectedTemplate, headerColor: headerColor, setHeaderColor: setHeaderColor, logo: logo, setLogo: (newLogo) => {
                    setLogo(newLogo);
                    if (newLogo)
                        localStorage.setItem('invoice-logo', newLogo);
                    else
                        localStorage.removeItem('invoice-logo');
                }, footerText: footerText, setFooterText: setFooterText, invoiceHistory: invoiceHistory, onClearCurrentInvoice: () => setInvoice(null), invoiceRef: invoiceRef, onExportPDF: handleSavePDF, onExportExcel: handleExportExcel, onExportJSON: handleExportJSON, darkMode: darkMode, showWatermark: userData?.plan === 'free', userPlan: userData?.plan || 'free', onOpenPricing: () => setShowPricing(true) })), activeTab === 'history' && (_jsx("div", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl", children: _jsx(InvoiceHistory, { invoices: invoiceHistory, onSelect: handleLoadFromHistory, onClose: () => setActiveTab('dashboard'), darkMode: darkMode, userPlan: userData?.plan || 'free' }) })), activeTab === 'settings' && (_jsxs("div", { className: "max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "Personalizaci\u00F3n de Marca" }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Ajusta los colores corporativos, bordes y preferencias de tus facturas FEL." })] }), _jsx(Settings, { borderColor: borderColor, headerColor: headerColor, onBorderColorChange: setBorderColor, onHeaderColorChange: setHeaderColor, darkMode: darkMode })] })), activeTab === 'pricing' && (_jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl", children: [_jsx("h2", { className: "text-2xl font-black mb-2", children: "Comprobante de Pago Manual" }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mb-6", children: "Sube el comprobante de tu transferencia bancaria para activar tu plan ilimitado." }), _jsx(UploadPaymentProof, {})] }) })), activeTab === 'admin' && isAdmin && (_jsx("div", { className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl", children: _jsx(AdminPanel, { onClose: () => setActiveTab('dashboard'), darkMode: darkMode }) })), showPricing && userData && (_jsx(PricingModal, { currentPlan: userData.plan, onClose: () => setShowPricing(false), onSelectPayPal: handleSelectPayPal, onSelectManual: handleSelectManual, darkMode: darkMode })), showPayPal && selectedPlanForPayment && (_jsx(PayPalCheckout, { planName: selectedPlanForPayment.name, amount: selectedPlanForPayment.amount, onSuccess: handlePaymentSuccess, onCancel: () => {
                    setShowPayPal(false);
                    setSelectedPlanForPayment(null);
                }, darkMode: darkMode })), showBankTransfer && selectedPlanForPayment && user && (_jsx(BankTransferModal, { planName: selectedPlanForPayment.name, amount: selectedPlanForPayment.amount, userId: user.uid, userEmail: user.email || '', onClose: () => {
                    setShowBankTransfer(false);
                    setSelectedPlanForPayment(null);
                }, darkMode: darkMode }))] }));
}
export default App;
