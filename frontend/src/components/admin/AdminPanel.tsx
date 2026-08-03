import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { X, Check, XCircle, Eye, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface UpgradeRequest {
  id: string;
  userId: string;
  userEmail: string;
  planRequested: string;
  amount: number;
  amountUSD?: number;
  paymentMethod: string;
  voucher?: string;
  paypalOrderId?: string;
  paypalPayerId?: string;
  paypalPayerEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp | string;
}

interface AdminPanelProps {
  onClose: () => void;
  darkMode?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, darkMode = false }) => {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      let q;
      if (filter === 'pending') {
        q = query(
          collection(db, 'upgrade_requests'),
          where('status', '==', 'pending')
        );
      } else {
        q = query(collection(db, 'upgrade_requests'));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UpgradeRequest[];
      
      // Ordenar por fecha más reciente
      data.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (request: UpgradeRequest) => {
    if (!confirm(`¿Aprobar upgrade de ${request.userEmail} al plan ${request.planRequested.toUpperCase()}?`)) {
      return;
    }

    try {
      // Mapear el plan al formato correcto de tu UserData
      const planMap: { [key: string]: 'free' | 'basic' | 'premium' | 'enterprise' } = {
        'pro': 'premium',
        'max': 'enterprise',
        'premium': 'premium',
        'enterprise': 'enterprise',
        'basic': 'basic'
      };
      
      const mappedPlan = planMap[request.planRequested.toLowerCase()] || 'premium';

      // Determinar límite de facturas según el plan
      const invoiceLimitMap: { [key: string]: number } = {
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
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error al aprobar solicitud');
    }
  };

  const handleReject = async (request: UpgradeRequest) => {
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
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error al rechazar solicitud');
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('¿Eliminar esta solicitud permanentemente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'upgrade_requests', requestId));
      toast.success('🗑️ Solicitud eliminada');
      loadRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Error al eliminar solicitud');
    }
  };

  const formatDate = (timestamp: Timestamp | string) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
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
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield size={32} />
              <div>
                <h2 className="text-2xl font-bold">Panel de Administrador</h2>
                <p className="text-sm text-purple-100">Gestión de solicitudes de upgrade</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' 
                  ? 'bg-white text-purple-600 font-semibold' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              Pendientes ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-white text-purple-600 font-semibold' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              Todas ({requests.length})
            </button>
            <button
              onClick={loadRequests}
              className="ml-auto px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Recargar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Cargando solicitudes...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Shield size={48} className="mx-auto text-gray-400 mb-4" />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filter === 'pending' ? 'No hay solicitudes pendientes' : 'No hay solicitudes'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-6 ${
                    darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-wrap gap-4 justify-between items-start">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {request.userEmail}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="space-y-1">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-semibold">Plan:</span>{' '}
                          <span className="text-purple-600 font-bold">{request.planRequested.toUpperCase()}</span>
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-semibold">Monto:</span>{' '}
                          <span className="font-bold">
                            Q{request.amount}
                            {request.amountUSD && ` (${request.amountUSD} USD)`}
                          </span>
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-semibold">Método:</span>{' '}
                          {request.paymentMethod === 'bank_transfer' ? '🏦 Transferencia bancaria' : '💳 PayPal'}
                        </p>
                        {request.paypalOrderId && (
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            PayPal ID: {request.paypalOrderId}
                          </p>
                        )}
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                          📅 {formatDate(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {request.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        {request.voucher && (
                          <button
                            onClick={() => setSelectedVoucher(request.voucher!)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                          >
                            <Eye size={16} />
                            Ver Comprobante
                          </button>
                        )}
                        <button
                          onClick={() => handleApprove(request)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                        >
                          <Check size={16} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                        >
                          <XCircle size={16} />
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          title="Eliminar solicitud"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Voucher */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVoucher(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedVoucher}
              alt="Comprobante de pago"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
