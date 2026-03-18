import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, signInWithEmail, logOut, handleFirestoreError, OperationType, requestForToken, onMessageListener, googleProvider } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'client' | 'coach' | 'admin';
  coachId?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'Male' | 'Female';
  goal?: string;
  setupCompleted?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (role: 'client' | 'coach' | 'admin', forceSelect?: boolean) => Promise<{ isNewUser: boolean }>;
  signUp: (email: string, pass: string, displayName: string, role: 'client' | 'coach') => Promise<void>;
  passwordSignIn: (username: string, pass: string, role: 'client' | 'coach') => Promise<void>;
  adminSignIn: (username: string, pass: string) => Promise<void>;
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonating: () => void;
  isImpersonating: boolean;
  initNotifications: () => Promise<void>;
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
            if (user.email === 'blagoje72@gmail.com' && data.role !== 'admin') {
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

  const signIn = async (role: 'client' | 'coach' | 'admin', forceSelect = false) => {
    try {
      if (forceSelect) {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
      } else {
        googleProvider.setCustomParameters({});
      }
      
      const { signInWithPopup, getAdditionalUserInfo } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser || false;

      // Persist last used google account for UX
      localStorage.setItem('aura_last_google_user', JSON.stringify({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));

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
        const isBootstrapAdmin = user.email === 'blagoje72@gmail.com';
        const finalRole = isBootstrapAdmin ? 'admin' : role;

        const newUserData: any = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Korisnik',
          photoURL: user.photoURL || '',
          role: finalRole,
          createdAt: serverTimestamp(),
          setupCompleted: false
        };
        
        // Attempt to extract birthdate if available (rare but good practice)
        if ((additionalInfo?.profile as any)?.birthday) {
           newUserData.birthday = (additionalInfo.profile as any).birthday;
        }

        try {
          await setDoc(userDocRef, newUserData);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
        }
        setUserData(newUserData);
      } else {
        const data = userDoc.data() as UserData;
        
        // Update profile picture if it changed
        if (user.photoURL && data.photoURL !== user.photoURL) {
          data.photoURL = user.photoURL;
          await setDoc(userDocRef, { photoURL: user.photoURL }, { merge: true });
        }

        // Force admin role for bootstrap email
        if (user.email === 'blagoje72@gmail.com' && data.role !== 'admin') {
          data.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
        setUserData(data);
      }

      return { isNewUser };
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error("Error signing in", error);
      }
      throw error;
    }
  };

  const signUp = async (email: string, pass: string, displayName: string, role: 'client' | 'coach') => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', user.user.uid);
      
      const newUserData: any = {
        uid: user.user.uid,
        email: email,
        displayName: displayName,
        role: role,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userDocRef, newUserData);
      setUserData(newUserData);
    } catch (error: any) {
      console.error("Error signing up", error);
      throw error;
    }
  };

  const adminSignIn = async (username: string, pass: string) => {
    try {
      // If username is already an email, use it, otherwise append suffix
      const email = username.includes('@') ? username : `${username}@system.local`;
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
          displayName: username.includes('@') ? username.split('@')[0] : username.charAt(0).toUpperCase() + username.slice(1),
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
        const data = userDoc.data() as UserData;
        // Force admin role if it's the bootstrap email or if they are signing in via admin portal
        if (data.role !== 'admin' || email === 'blagoje72@gmail.com') {
          data.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
        setUserData(data);
      }
    } catch (error: any) {
      console.error("Error signing in as admin", error);
      throw error;
    }
  };

  const passwordSignIn = async (username: string, pass: string, role: 'client' | 'coach') => {
    try {
      // If username is already an email, use it, otherwise append suffix
      const email = username.includes('@') ? username : `${username}@aura.fit`;
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
        // Bootstrap admin check even for password login if email matches
        const isBootstrapAdmin = email === 'blagoje72@gmail.com';
        const finalRole = isBootstrapAdmin ? 'admin' : role;

        const newUserData: any = {
          uid: user.uid,
          email: email,
          displayName: username.includes('@') ? username.split('@')[0] : username.charAt(0).toUpperCase() + username.slice(1),
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
        if (email === 'blagoje72@gmail.com' && data.role !== 'admin') {
          data.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
        setUserData(data);
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

  const initNotifications = async () => {
    if (!currentUser) return;
    try {
      const token = await requestForToken();
      if (token) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          fcmToken: token,
          notificationsEnabled: true
        }, { merge: true });
        console.log('FCM Token registered');
      }
    } catch (error) {
      console.error('Error initializing notifications', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userData, 
      loading, 
      signIn, 
      signUp,
      passwordSignIn,
      adminSignIn, 
      signOut,
      impersonateUser,
      stopImpersonating,
      isImpersonating: !!originalUserData,
      initNotifications
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
