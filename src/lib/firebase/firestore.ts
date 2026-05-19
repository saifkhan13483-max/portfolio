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

// Generic CRUD helper
const createCRUD = <T extends { id?: string }>(collectionName: string) => {
  const colRef = collection(db, collectionName);

  return {
    getAll: async (): Promise<T[]> => {
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },
    getById: async (id: string): Promise<T | null> => {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
    },
    subscribeAll: (callback: (data: T[]) => void): Unsubscribe => {
      return onSnapshot(colRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        callback(data);
      });
    },
    create: async (data: Omit<T, 'id'>): Promise<string> => {
      const docRef = await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },
    update: async (id: string, data: Partial<T>): Promise<void> => {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    delete: async (id: string): Promise<void> => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    }
  };
};

export const projectsApi = createCRUD<Project>('projects');
export const servicesApi = createCRUD<Service>('services');
export const ordersApi = createCRUD<Order>('orders');

// Local fallback for services if Firestore is empty/inaccessible
const localServices: Service[] = [
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
    return localServices;
  } catch (error) {
    console.error("Error fetching services, using fallback:", error);
    return localServices;
  }
};

// Special queries
export const getFeaturedProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, 'projects'), where('featured', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getActiveServices = async (): Promise<Service[]> => {
  try {
    const q = query(collection(db, 'services'), where('active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    }
    return localServices.filter(s => s.active);
  } catch (error) {
    console.error("Error fetching active services, using fallback:", error);
    return localServices.filter(s => s.active);
  }
};
