import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { X, Check, XCircle, Eye, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
export const AdminPanel = ({ onClose, darkMode = false }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [filter, setFilter] = useState('pending');
    const loadRequests = useCallback(async () => {
        setLoading(true);
        try {
            let q;
            if (filter === 'pending') {
                q = query(collection(db, 'upgrade_requests'), where('status', '==', 'pending'));
            }
            else {
                q = query(collection(db, 'upgrade_requests'));
            }
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Ordenar por fecha más reciente
            data.sort((a, b) => {
                const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });
            setRequests(data);
        }
        catch (error) {
            console.error('Error loading requests:', error);
            toast.error('Error al cargar solicitudes');
        }
        finally {
            setLoading(false);
        }
    }, [filter]);
    useEffect(() => {
        loadRequests();
    }, [loadRequests]);
    const handleApprove = async (request) => {
        if (!confirm(`¿Aprobar upgrade de ${request.userEmail} al plan ${request.planRequested.toUpperCase()}?`)) {
            return;
        }
        try {
            // Mapear el plan al formato correcto de tu UserData
            const planMap = {
                'pro': 'premium',
                'max': 'enterprise',
                'premium': 'premium',
                'enterprise': 'enterprise',
                'basic': 'basic'
            };
            const mappedPlan = planMap[request.planRequested.toLowerCase()] || 'premium';
            // Determinar límite de facturas según el plan
            const invoiceLimitMap = {
                'free': 10,
                'basic': 100,
                'premium': 100,
                'enterprise': 999999
            };
            const invoiceLimit = invoiceLimitMap[mappedPlan];
            // Actualizar plan del usuario
            const userRef = doc(db, 'users', request.userId);
            await updateDoc(userRef, {
                plan: mappedPlan,
                invoiceLimit: invoiceLimit,
                lastPaymentDate: serverTimestamp(),
                lastPaymentMethod: request.paymentMethod,
                upgradedAt: serverTimestamp()
            });
            // Actualizar estado de la solicitud
            const requestRef = doc(db, 'upgrade_requests', request.id);
            await updateDoc(requestRef, {
                status: 'approved',
                approvedAt: serverTimestamp()
            });
            toast.success(`✅ Plan ${request.planRequested.toUpperCase()} activado para ${request.userEmail}`);
            loadRequests();
        }
        catch (error) {
            console.error('Error approving request:', error);
            toast.error('Error al aprobar solicitud');
        }
    };
    const handleReject = async (request) => {
        const reason = prompt('Motivo del rechazo (opcional):');
        try {
            const requestRef = doc(db, 'upgrade_requests', request.id);
            await updateDoc(requestRef, {
                status: 'rejected',
                rejectedAt: serverTimestamp(),
                rejectionReason: reason || 'Sin especificar'
            });
            toast.success('❌ Solicitud rechazada');
            loadRequests();
        }
        catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Error al rechazar solicitud');
        }
    };
    const handleDelete = async (requestId) => {
        if (!confirm('¿Eliminar esta solicitud permanentemente?')) {
            return;
        }
        try {
            await deleteDoc(doc(db, 'upgrade_requests', requestId));
            toast.success('🗑️ Solicitud eliminada');
            loadRequests();
        }
        catch (error) {
            console.error('Error deleting request:', error);
            toast.error('Error al eliminar solicitud');
        }
    };
    const formatDate = (timestamp) => {
        if (!timestamp)
            return 'Fecha no disponible';
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
        const labels = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado'
        };
        return (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`, children: labels[status] }));
    };
    return (_jsxs("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: [_jsxs("div", { className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`, children: [_jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Shield, { size: 32 }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Panel de Administrador" }), _jsx("p", { className: "text-sm text-purple-100", children: "Gesti\u00F3n de solicitudes de upgrade" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-white/20 rounded-lg transition-colors", children: _jsx(X, { size: 24 }) })] }), _jsxs("div", { className: "flex gap-4 mt-4", children: [_jsxs("button", { onClick: () => setFilter('pending'), className: `px-4 py-2 rounded-lg transition-colors ${filter === 'pending'
                                            ? 'bg-white text-purple-600 font-semibold'
                                            : 'bg-white/20 hover:bg-white/30'}`, children: ["Pendientes (", requests.filter(r => r.status === 'pending').length, ")"] }), _jsxs("button", { onClick: () => setFilter('all'), className: `px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                            ? 'bg-white text-purple-600 font-semibold'
                                            : 'bg-white/20 hover:bg-white/30'}`, children: ["Todas (", requests.length, ")"] }), _jsxs("button", { onClick: loadRequests, className: "ml-auto px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2", children: [_jsx(RefreshCw, { size: 16 }), "Recargar"] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: loading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" }), _jsx("p", { className: `mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: "Cargando solicitudes..." })] })) : requests.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Shield, { size: 48, className: "mx-auto text-gray-400 mb-4" }), _jsx("p", { className: `text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: filter === 'pending' ? 'No hay solicitudes pendientes' : 'No hay solicitudes' })] })) : (_jsx("div", { className: "space-y-4", children: requests.map((request) => (_jsx("div", { className: `border rounded-lg p-6 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`, children: _jsxs("div", { className: "flex flex-wrap gap-4 justify-between items-start", children: [_jsxs("div", { className: "flex-1 min-w-[250px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: `font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`, children: request.userEmail }), getStatusBadge(request.status)] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: [_jsx("span", { className: "font-semibold", children: "Plan:" }), ' ', _jsx("span", { className: "text-purple-600 font-bold", children: request.planRequested.toUpperCase() })] }), _jsxs("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: [_jsx("span", { className: "font-semibold", children: "Monto:" }), ' ', _jsxs("span", { className: "font-bold", children: ["Q", request.amount, request.amountUSD && ` (${request.amountUSD} USD)`] })] }), _jsxs("p", { className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`, children: [_jsx("span", { className: "font-semibold", children: "M\u00E9todo:" }), ' ', request.paymentMethod === 'bank_transfer' ? '🏦 Transferencia bancaria' : '💳 PayPal'] }), request.paypalOrderId && (_jsxs("p", { className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`, children: ["PayPal ID: ", request.paypalOrderId] })), _jsxs("p", { className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`, children: ["\uD83D\uDCC5 ", formatDate(request.createdAt)] })] })] }), request.status === 'pending' && (_jsxs("div", { className: "flex gap-2 flex-wrap", children: [request.voucher && (_jsxs("button", { onClick: () => setSelectedVoucher(request.voucher), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors", children: [_jsx(Eye, { size: 16 }), "Ver Comprobante"] })), _jsxs("button", { onClick: () => handleApprove(request), className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors", children: [_jsx(Check, { size: 16 }), "Aprobar"] }), _jsxs("button", { onClick: () => handleReject(request), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors", children: [_jsx(XCircle, { size: 16 }), "Rechazar"] }), _jsx("button", { onClick: () => handleDelete(request.id), className: "px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors", title: "Eliminar solicitud", children: _jsx(X, { size: 16 }) })] }))] }) }, request.id))) })) })] }), selectedVoucher && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4", children: _jsxs("div", { className: "relative max-w-4xl w-full", children: [_jsx("button", { onClick: () => setSelectedVoucher(null), className: "absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors", children: _jsx(X, { size: 24 }) }), _jsx("img", { src: selectedVoucher, alt: "Comprobante de pago", className: "w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl" })] }) }))] }));
};
