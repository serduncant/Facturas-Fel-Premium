import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useAdmin = () => {
  const { user, userData } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Verificación directa para usuarios demo/admin locales
      if (
        user.email === 'admin@felpro.gt' || 
        user.uid === 'admin_demo_uid' || 
        userData?.plan === 'enterprise'
      ) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      try {
        if (db) {
          const adminDoc = await getDoc(doc(db, 'admins', user.email));
          if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking admin:', error);
      }
      
      setIsAdmin(false);
      setLoading(false);
    };

    checkAdmin();
  }, [user, userData]);

  return { isAdmin, loading };
};
