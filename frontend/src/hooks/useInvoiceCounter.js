import { doc, setDoc, increment, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
export const incrementInvoiceCount = async (userId) => {
    if (!userId)
        return;
    try {
        const userRef = doc(db, 'users', userId);
        // Usar setDoc con merge: true en lugar de updateDoc para evitar errores si el documento no existe en Firestore aún
        await setDoc(userRef, {
            invoiceCount: increment(1),
            lastInvoiceDate: new Date().toISOString()
        }, { merge: true });
    }
    catch (error) {
        console.warn('Incremento de contador en Firestore omitido o no encontrado (modo seguro local):', error);
    }
};
export const canProcessInvoice = (invoiceCount, invoiceLimit) => {
    return invoiceCount < invoiceLimit;
};
export const getRemainingInvoices = (invoiceCount, invoiceLimit) => {
    return Math.max(0, invoiceLimit - invoiceCount);
};
export const getUsagePercentage = (invoiceCount, invoiceLimit) => {
    if (invoiceLimit >= 999999)
        return 0; // Ilimitado
    return (invoiceCount / invoiceLimit) * 100;
};
export const resetMonthlyInvoiceCount = async (userId) => {
    if (!userId)
        return;
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastReset = userData.lastCounterReset ? new Date(userData.lastCounterReset) : null;
            const now = new Date();
            if (!lastReset || (now.getTime() - lastReset.getTime()) > 30 * 24 * 60 * 60 * 1000) {
                await updateDoc(userRef, {
                    invoiceCount: 0,
                    lastCounterReset: now.toISOString()
                });
            }
        }
    }
    catch (error) {
        console.warn('Reset mensual omitido:', error);
    }
};
