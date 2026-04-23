/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

async function getFirebaseConfig() {
  try {
    const config = await import("../../firebase-applet-config.json");
    return config.default;
  } catch (error) {
    console.error("Firebase config not found. Please run set_up_firebase tool.");
    return null;
  }
}

export async function initFirebase() {
  if (getApps().length > 0) return { app, auth, db };

  const config = await getFirebaseConfig();
  if (!config) throw new Error("Firebase NOT initialized. Missing config.");

  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  return { app, auth, db };
}

// Lazy getters to prevent crashes on startup
export const getDB = () => db;
export const getAuthService = () => auth;
