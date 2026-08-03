import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const incrementInvoiceCount = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    invoiceCount: increment(1),
    lastInvoiceDate: new Date().toISOString()
  });
};

export const canProcessInvoice = (invoiceCount: number, invoiceLimit: number): boolean => {
  return invoiceCount < invoiceLimit;
};

export const getRemainingInvoices = (invoiceCount: number, invoiceLimit: number): number => {
  return Math.max(0, invoiceLimit - invoiceCount);
};

export const getUsagePercentage = (invoiceCount: number, invoiceLimit: number): number => {
  if (invoiceLimit === 999999) return 0; // Ilimitado
  return (invoiceCount / invoiceLimit) * 100;
};

// Función para resetear el contador mensualmente (llamar desde un cron job o Cloud Function)
export const resetMonthlyInvoiceCount = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const lastReset = userData.lastCounterReset ? new Date(userData.lastCounterReset) : null;
    const now = new Date();
    
    // Si ha pasado un mes desde el último reset
    if (!lastReset || (now.getTime() - lastReset.getTime()) > 30 * 24 * 60 * 60 * 1000) {
      await updateDoc(userRef, {
        invoiceCount: 0,
        lastCounterReset: now.toISOString()
      });
    }
  }
};
