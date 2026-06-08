/**
 * Firestore LITE instance — uses firebase/firestore/lite (REST-only, ~17KB gzipped).
 * For public read-only pages only. Does NOT support onSnapshot / real-time listeners.
 * Admin pages and any real-time feature must use the full `db` from config.ts.
 */
import { getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// getApp() returns the already-initialized Firebase app from config.ts.
// This module intentionally imports NO code from firebase/firestore (full SDK)
// so it tree-shakes into its own vendor-firebase-firestore-lite chunk.
export const dbLite = getFirestore(getApp());
