/**
 * Public read-only Firestore helpers using the Lite SDK (~17KB vs ~60KB full).
 * These are purely GET operations — no real-time listeners, no mutations.
 * Use these in public-facing pages (Portfolio, Services, Home).
 *
 * Admin mutations and real-time subscriptions (onSnapshot) stay in firestore.ts
 * which uses the full firebase/firestore SDK.
 */
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import { dbLite } from "./config-lite";
import type { Project, Service } from "@/types";

const LOCAL_FALLBACK_SERVICES: Service[] = [
  {
    id: "full-stack-web-development",
    title: "Full Stack Web Development",
    description:
      "Comprehensive digital solutions tailored to help your business grow. We handle everything from design to deployment.",
    features: [
      "Custom Web Applications",
      "Responsive UI/UX Design",
      "Robust Backend Systems",
      "Database Integration",
      "API Development",
      "Deployment & Hosting",
    ],
    pricing: "Starting at $2,500",
    deliveryTime: "4-8 weeks",
    category: "Development",
    active: true,
  },
];

export async function getProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(collection(dbLite, "projects"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch (err) {
    console.error("[firestore-lite] getProjects failed:", err);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const snap = await getDoc(doc(dbLite, "projects", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
  } catch (err) {
    console.error("[firestore-lite] getProject failed:", err);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const snap = await getDocs(collection(dbLite, "services"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
  } catch (err) {
    console.error("[firestore-lite] getServices failed:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const q = query(collection(dbLite, "projects"), where("featured", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch (err) {
    console.error("[firestore-lite] getFeaturedProjects failed:", err);
    return [];
  }
}

export async function getServicesWithFallback(): Promise<Service[]> {
  try {
    const services = await getServices();
    return services.length > 0 ? services : LOCAL_FALLBACK_SERVICES;
  } catch (err) {
    console.error("[firestore-lite] getServicesWithFallback failed:", err);
    return LOCAL_FALLBACK_SERVICES;
  }
}

export async function getActiveServices(): Promise<Service[]> {
  try {
    const q = query(collection(dbLite, "services"), where("active", "==", true));
    const snap = await getDocs(q);
    if (snap.docs.length > 0) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
    }
    return LOCAL_FALLBACK_SERVICES.filter((s) => s.active);
  } catch (err) {
    console.error("[firestore-lite] getActiveServices failed:", err);
    return LOCAL_FALLBACK_SERVICES.filter((s) => s.active);
  }
}
