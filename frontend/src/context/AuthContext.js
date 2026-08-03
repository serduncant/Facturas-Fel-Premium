import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
const LOCAL_USER_KEY = 'felpro_local_user';
const LOCAL_USERDATA_KEY = 'felpro_local_userdata';
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // 1. Cargar usuario de desarrollo local desde localStorage si existe
        const savedLocalUser = localStorage.getItem(LOCAL_USER_KEY);
        const savedLocalData = localStorage.getItem(LOCAL_USERDATA_KEY);
        if (savedLocalUser && savedLocalData) {
            try {
                setUser(JSON.parse(savedLocalUser));
                setUserData(JSON.parse(savedLocalData));
                setLoading(false);
                return;
            }
            catch (e) {
                console.error('Error parsing local user state:', e);
            }
        }
        // 2. Suscripción Firebase Auth con fallback
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
        let unsubscribe = () => { };
        try {
            if (auth) {
                unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                    clearTimeout(timer);
                    if (currentUser) {
                        setUser(currentUser);
                        try {
                            const isSuperAdmin = currentUser.email?.toLowerCase() === 'xirmoll@gmail.com';
                            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                            if (userDoc.exists()) {
                                const data = userDoc.data();
                                if (isSuperAdmin) {
                                    data.plan = 'enterprise';
                                    data.invoiceLimit = 999999;
                                }
                                setUserData(data);
                            }
                            else {
                                // Valores por defecto
                                const defaultData = {
                                    email: currentUser.email || 'usuario@felpro.gt',
                                    displayName: currentUser.displayName || 'Usuario FEL PRO',
                                    plan: isSuperAdmin ? 'enterprise' : 'free',
                                    invoiceCount: 0,
                                    invoiceLimit: isSuperAdmin ? 999999 : 10,
                                    createdAt: new Date().toISOString()
                                };
                                setUserData(defaultData);
                            }
                        }
                        catch (e) {
                            console.error('Error loading Firestore user data:', e);
                        }
                    }
                    else {
                        if (!localStorage.getItem(LOCAL_USER_KEY)) {
                            setUser(null);
                            setUserData(null);
                        }
                    }
                    setLoading(false);
                }, (error) => {
                    console.error('Error Firebase Auth:', error);
                    clearTimeout(timer);
                    setLoading(false);
                });
            }
            else {
                clearTimeout(timer);
                setLoading(false);
            }
        }
        catch (err) {
            console.error('Firebase setup exception:', err);
            clearTimeout(timer);
            setLoading(false);
        }
        return () => {
            clearTimeout(timer);
            unsubscribe();
        };
    }, []);
    const saveLocalAuth = (mockUser, data) => {
        setUser(mockUser);
        setUserData(data);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(LOCAL_USERDATA_KEY, JSON.stringify(data));
    };
    const register = async (email, password, displayName) => {
        const isSuperAdmin = email.toLowerCase() === 'xirmoll@gmail.com';
        const plan = isSuperAdmin ? 'enterprise' : 'free';
        const invoiceLimit = isSuperAdmin ? 999999 : 10;
        try {
            if (auth && import.meta.env.VITE_FIREBASE_API_KEY) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUserData = {
                    email,
                    displayName,
                    plan,
                    invoiceCount: 0,
                    invoiceLimit,
                    createdAt: new Date().toISOString()
                };
                try {
                    await setDoc(doc(db, 'users', userCredential.user.uid), newUserData, { merge: true });
                }
                catch (e) {
                    console.warn('Firestore setDoc omitido (modo local activo)');
                }
                setUserData(newUserData);
                return;
            }
        }
        catch (firebaseErr) {
            console.warn('Firebase registration fallback to Local Auth:', firebaseErr);
        }
        // Fallback local instantáneo si Firebase falla o no tiene API Key real
        const mockUid = 'user_' + Date.now();
        const newUserData = {
            email,
            displayName,
            plan,
            invoiceCount: 0,
            invoiceLimit,
            createdAt: new Date().toISOString()
        };
        saveLocalAuth({ uid: mockUid, email }, newUserData);
    };
    const login = async (email, password) => {
        const isSuperAdmin = email.toLowerCase() === 'xirmoll@gmail.com';
        const plan = isSuperAdmin ? 'enterprise' : 'free';
        const invoiceLimit = isSuperAdmin ? 999999 : 10;
        try {
            if (auth && import.meta.env.VITE_FIREBASE_API_KEY) {
                await signInWithEmailAndPassword(auth, email, password);
                return;
            }
        }
        catch (firebaseErr) {
            console.warn('Firebase login fallback to Local Auth:', firebaseErr);
        }
        // Fallback local instantáneo
        const mockUid = 'user_' + Date.now();
        const mockUserData = {
            email,
            displayName: email.split('@')[0],
            plan,
            invoiceCount: 0,
            invoiceLimit,
            createdAt: new Date().toISOString()
        };
        saveLocalAuth({ uid: mockUid, email }, mockUserData);
    };
    const guestLogin = (role = 'guest') => {
        const isDemoAdmin = role === 'admin';
        const mockUid = isDemoAdmin ? 'admin_demo_uid' : 'guest_demo_uid';
        const mockEmail = isDemoAdmin ? 'admin@felpro.gt' : 'invitado@felpro.gt';
        const mockData = {
            email: mockEmail,
            displayName: isDemoAdmin ? 'Administrador Demo' : 'Usuario Invitado',
            plan: isDemoAdmin ? 'enterprise' : 'free',
            invoiceCount: 0,
            invoiceLimit: isDemoAdmin ? 999999 : 10,
            createdAt: new Date().toISOString()
        };
        saveLocalAuth({ uid: mockUid, email: mockEmail }, mockData);
    };
    const logout = async () => {
        if (auth) {
            try {
                await signOut(auth);
            }
            catch (e) {
                console.warn('Firebase logout Exception:', e);
            }
        }
        localStorage.removeItem(LOCAL_USER_KEY);
        localStorage.removeItem(LOCAL_USERDATA_KEY);
        setUser(null);
        setUserData(null);
    };
    const resetPassword = async (email) => {
        if (auth && import.meta.env.VITE_FIREBASE_API_KEY) {
            await sendPasswordResetEmail(auth, email);
        }
    };
    const value = {
        user,
        userData,
        loading,
        register,
        login,
        guestLogin,
        logout,
        resetPassword,
        setUserData
    };
    return (_jsx(AuthContext.Provider, { value: value, children: loading ? (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-blue-500/20 animate-pulse", children: "F" }), _jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-sm font-medium", children: [_jsx("div", { className: "w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Cargando Visualizador FEL PRO..." })] })] }) })) : (children) }));
};
