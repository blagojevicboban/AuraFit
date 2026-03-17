import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, signInWithEmail, logOut } from '../lib/firebase';

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
  adminSignIn: (username: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          // If user doesn't exist in DB, we'll create them during sign-in
          setUserData(null);
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
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user profile
        const newUserData: any = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Korisnik',
          role: role,
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data() as UserData);
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
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new admin profile
        const newUserData: any = {
          uid: user.uid,
          email: email,
          displayName: 'Administrator',
          role: 'admin',
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error: any) {
      console.error("Error signing in as admin", error);
      throw error;
    }
  };

  const signOut = async () => {
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, signIn, adminSignIn, signOut }}>
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
