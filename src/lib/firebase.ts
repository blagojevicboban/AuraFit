import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error?.code !== 'auth/popup-closed-by-user') {
      console.error("Error signing in with Google", error);
    }
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    // If user doesn't exist, we can create it (for the admin account)
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      console.log("User not found, attempting to create...");
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        return result.user;
      } catch (createError) {
        console.error("Error creating user", createError);
        throw createError;
      }
    }
    console.error("Error signing in with Email", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
