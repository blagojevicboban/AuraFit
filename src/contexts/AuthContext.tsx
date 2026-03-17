import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, signInWithEmail, logOut, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'coach' | 'admin';
  coachId?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (role: 'client' | 'coach' | 'admin') => Promise<void>;
  passwordSignIn: (username: string, pass: string, role: 'client' | 'coach') => Promise<void>;
  adminSignIn: (username: string, pass: string) => Promise<void>;
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonating: () => void;
  isImpersonating: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            // Force admin role for bootstrap email
            if (user.email === 'ai4vetschools@gmail.com' && data.role !== 'admin') {
              data.role = 'admin';
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }
            setUserData(data);
          } else {
            setUserData(null);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (role: 'client' | 'coach' | 'admin') => {
    try {
      const user = await signInWithGoogle();
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
      
      if (!userDoc?.exists()) {
        // Create new user profile
        // Bootstrap admin check
        const isBootstrapAdmin = user.email === 'ai4vetschools@gmail.com';
        const finalRole = isBootstrapAdmin ? 'admin' : role;

        const newUserData: any = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Korisnik',
          role: finalRole,
          createdAt: serverTimestamp(),
        };
        try {
          await setDoc(userDocRef, newUserData);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        setUserData(newUserData);
      } else {
        const data = userDoc.data() as UserData;
        // Force admin role for bootstrap email
        if (user.email === 'ai4vetschools@gmail.com' && data.role !== 'admin') {
          data.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
        setUserData(data);
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error("Error signing in", error);
      }
      throw error;
    }
  };

  const adminSignIn = async (username: string, pass: string) => {
    try {
      // Map username to an email format for Firebase Auth
      const email = `${username}@system.local`;
      const user = await signInWithEmail(email, pass);
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
      
      if (!userDoc?.exists()) {
        // Create new admin profile
        const newUserData: any = {
          uid: user.uid,
          email: email,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          role: 'admin',
          createdAt: serverTimestamp(),
        };
        try {
          await setDoc(userDocRef, newUserData);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error: any) {
      console.error("Error signing in as admin", error);
      throw error;
    }
  };

  const passwordSignIn = async (username: string, pass: string, role: 'client' | 'coach') => {
    try {
      // Map username to an email format for Firebase Auth
      const email = `${username}@aura.fit`;
      const user = await signInWithEmail(email, pass);
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
      
      if (!userDoc?.exists()) {
        // Create new profile
        const newUserData: any = {
          uid: user.uid,
          email: email,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          role: role,
          createdAt: serverTimestamp(),
        };
        try {
          await setDoc(userDocRef, newUserData);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error: any) {
      console.error(`Error signing in as ${role}`, error);
      throw error;
    }
  };

  const signOut = async () => {
    setOriginalUserData(null);
    await logOut();
  };

  const impersonateUser = async (userId: string) => {
    if (userData?.role !== 'admin' && !originalUserData) {
      throw new Error("Only admins can impersonate users");
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        if (!originalUserData) {
          setOriginalUserData(userData);
        }
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    }
  };

  const stopImpersonating = () => {
    if (originalUserData) {
      setUserData(originalUserData);
      setOriginalUserData(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userData, 
      loading, 
      signIn, 
      passwordSignIn,
      adminSignIn, 
      signOut,
      impersonateUser,
      stopImpersonating,
      isImpersonating: !!originalUserData
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
