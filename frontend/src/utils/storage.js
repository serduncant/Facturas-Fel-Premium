const STORAGE_KEY = 'invoice-history';
const MAX_INVOICES = 50;
export const saveInvoice = (invoice) => {
    try {
        const history = getInvoices();
        const exists = history.some(inv => inv.certificador.autorizacion === invoice.certificador.autorizacion);
        if (!exists) {
            const updatedHistory = [
                { ...invoice, savedAt: new Date().toISOString() },
                ...history
            ].slice(0, MAX_INVOICES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        }
    }
    catch (error) {
        console.error('Error saving invoice to history:', error);
    }
};
export const getInvoices = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch (error) {
        console.error('Error loading invoice history:', error);
        return [];
    }
};
export const clearInvoices = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }
    catch (error) {
        console.error('Error clearing invoice history:', error);
    }
};
export const deleteInvoice = (autorizacion) => {
    try {
        const history = getInvoices();
        const filtered = history.filter(inv => inv.certificador.autorizacion !== autorizacion);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    catch (error) {
        console.error('Error deleting invoice:', error);
    }
};
