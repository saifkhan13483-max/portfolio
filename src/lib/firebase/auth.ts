import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get current user (Promise based)
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

/**
 * Check if user is admin
 * Compares user email against a whitelist in environment variables or checks a 'users' collection in Firestore
 */
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user || !user.email) return false;

  // 1. Check environment variable whitelist (comma-separated emails)
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "").split(",").map((e: string) => e.trim());
  if (adminEmails.includes(user.email)) {
    return true;
  }

  // 2. Check Firestore 'users' collection for admin role
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === "admin";
    }
  } catch (error) {
    console.error("Error checking admin status in Firestore:", error);
  }

  return false;
};
