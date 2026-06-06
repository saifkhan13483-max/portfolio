import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { Project, Service, Order } from '@/types';

/**
 * Creates a typed Firestore CRUD helper for a given collection.
 * All async methods throw on failure — callers (hooks/pages) should
 * handle errors via try/catch or React Query's `onError`.
 */
const createCRUD = <T extends { id?: string }>(collectionName: string) => {
  const colRef = collection(db, collectionName);

  return {
    getAll: async (): Promise<T[]> => {
      try {
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      } catch (error) {
        console.error(`[firestore] getAll(${collectionName}) failed:`, error);
        throw new Error(`Failed to fetch ${collectionName}.`);
      }
    },

    getById: async (id: string): Promise<T | null> => {
      try {
        const docRef = doc(db, collectionName, id);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
      } catch (error) {
        console.error(`[firestore] getById(${collectionName}, ${id}) failed:`, error);
        throw new Error(`Failed to fetch ${collectionName} document.`);
      }
    },

    /**
     * Subscribes to real-time updates for the collection.
     * @param callback - Called with the full document list on each change.
     * @param onError  - Optional error handler for subscription failures.
     */
    subscribeAll: (
      callback: (data: T[]) => void,
      onError?: (error: Error) => void
    ): Unsubscribe => {
      return onSnapshot(
        colRef,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
          callback(data);
        },
        (error) => {
          console.error(`[firestore] subscribeAll(${collectionName}) error:`, error);
          onError?.(error);
        }
      );
    },

    create: async (data: Omit<T, 'id'>): Promise<string> => {
      try {
        const docRef = await addDoc(colRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (error) {
        console.error(`[firestore] create(${collectionName}) failed:`, error);
        throw new Error(`Failed to create ${collectionName} document.`);
      }
    },

    update: async (id: string, data: Partial<T>): Promise<void> => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error(`[firestore] update(${collectionName}, ${id}) failed:`, error);
        throw new Error(`Failed to update ${collectionName} document.`);
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error(`[firestore] delete(${collectionName}, ${id}) failed:`, error);
        throw new Error(`Failed to delete ${collectionName} document.`);
      }
    },
  };
};

export const projectsApi = createCRUD<Project>('projects');
export const servicesApi = createCRUD<Service>('services');
export const ordersApi = createCRUD<Order>('orders');

/**
 * Static fallback services shown when Firestore is empty or unreachable.
 * Keep these in sync with the real services managed in the admin dashboard.
 * Once the database is populated this data is never used in production.
 */
const LOCAL_FALLBACK_SERVICES: Service[] = [
  {
    id: "full-stack-web-development",
    title: "Full Stack Web Development",
    description: "Comprehensive digital solutions tailored to help your business grow. We handle everything from design to deployment.",
    features: [
      "Custom Web Applications",
      "Responsive UI/UX Design",
      "Robust Backend Systems",
      "Database Integration",
      "API Development",
      "Deployment & Hosting"
    ],
    pricing: "Starting at $2,500",
    deliveryTime: "4-8 weeks",
    category: "Development",
    active: true
  }
];

export const getServicesWithFallback = async (): Promise<Service[]> => {
  try {
    const services = await servicesApi.getAll();
    if (services.length > 0) return services;
    return LOCAL_FALLBACK_SERVICES;
  } catch (error) {
    console.error("Error fetching services, using fallback:", error);
    return LOCAL_FALLBACK_SERVICES;
  }
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const q = query(collection(db, 'projects'), where('featured', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
};

export const getActiveServices = async (): Promise<Service[]> => {
  try {
    const q = query(collection(db, 'services'), where('active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    }
    return LOCAL_FALLBACK_SERVICES.filter(s => s.active);
  } catch (error) {
    console.error("Error fetching active services, using fallback:", error);
    return LOCAL_FALLBACK_SERVICES.filter(s => s.active);
  }
};
