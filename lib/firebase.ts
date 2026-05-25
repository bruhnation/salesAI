"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Firestore,
} from "firebase/firestore";

import {
  defaultMetrics,
  type MetricsSummary,
  type SessionRecord,
} from "@/lib/sales-app-data";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export async function ensureFirebaseUser(): Promise<User | null> {
  const app = getFirebaseApp();
  if (!app) return null;

  const auth = getAuth(app);
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
        return;
      }

      try {
        const credential = await signInAnonymously(auth);
        resolve(credential.user);
      } catch {
        resolve(null);
      }
    });
  });
}

function localKey(key: string) {
  return `sales-master:${key}`;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(localKey(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localKey(key), JSON.stringify(value));
}

function calculateStreak(sessions: SessionRecord[]) {
  const completedDays = new Set(
    sessions.map((session) =>
      new Date(session.completedAtMs).toISOString().slice(0, 10)
    )
  );

  let streak = 0;
  const cursor = new Date();
  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function deriveMetricsFromSessions(sessions: SessionRecord[]): MetricsSummary {
  if (sessions.length === 0) return defaultMetrics;

  const xp = sessions.reduce((total, session) => total + session.xpAwarded, 0);
  const userWords = sessions.reduce(
    (total, session) =>
      total +
      session.messages
        .filter((message) => message.role === "user")
        .reduce((sum, message) => sum + message.text.trim().split(/\s+/).length, 0),
    0
  );
  const aiWords = sessions.reduce(
    (total, session) =>
      total +
      session.messages
        .filter((message) => message.role === "ai")
        .reduce((sum, message) => sum + message.text.trim().split(/\s+/).length, 0),
    0
  );
  const totalWords = userWords + aiWords;

  return {
    xp,
    level: Math.max(1, Math.floor(xp / 600) + 1),
    streak: calculateStreak(sessions),
    callsCompleted: sessions.length,
    winRate: 0,
    objectionScore: 0,
    talkListenBalance:
      totalWords === 0 ? 0 : Math.round((userWords / totalWords) * 100),
  };
}

function readLocalSessions() {
  return readLocal<SessionRecord[]>("sessions", []);
}

function writeLocalSession(session: SessionRecord) {
  const sessions = readLocalSessions();
  writeLocal("sessions", [session, ...sessions]);
}

export async function getRecentSessions(maxCount = 5): Promise<SessionRecord[]> {
  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();

  if (!user || !db) return readLocalSessions().slice(0, maxCount);

  const snap = await getDocs(
    query(
      collection(db, "users", user.uid, "sessions"),
      orderBy("completedAtMs", "desc"),
      limit(maxCount)
    )
  );

  return snap.docs.map((sessionDoc) => ({
    id: sessionDoc.id,
    ...(sessionDoc.data() as Omit<SessionRecord, "id">),
  }));
}

export async function getMetrics(): Promise<MetricsSummary> {
  const sessions = await getRecentSessions(100);
  return deriveMetricsFromSessions(sessions);
}

export async function saveMetrics(metrics: MetricsSummary) {
  writeLocal("metrics", metrics);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) return;

  await setDoc(doc(db, "users", user.uid, "state", "metrics"), metrics, {
    merge: true,
  });
}

export async function recordSessionCompletion(input: {
  scenario: string;
  character: string;
  messages: Array<{ role: "ai" | "user"; text: string; timestamp: string }>;
}) {
  const session: SessionRecord = {
    id: `session-${Date.now()}`,
    ...input,
    completedAtMs: Date.now(),
    xpAwarded: 150,
  };

  writeLocalSession(session);

  const nextMetrics = deriveMetricsFromSessions(readLocalSessions());
  await saveMetrics(nextMetrics);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) return nextMetrics;

  await addDoc(collection(db, "users", user.uid, "sessions"), {
    scenario: session.scenario,
    character: session.character,
    messages: session.messages,
    completedAtMs: session.completedAtMs,
    completedAt: serverTimestamp(),
    xpAwarded: session.xpAwarded,
  });

  return nextMetrics;
}

export async function saveCustomCustomer(customer: Record<string, unknown>) {
  writeLocal("lastCustomCustomer", customer);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) return;

  await addDoc(collection(db, "users", user.uid, "customCustomers"), {
    ...customer,
    createdAt: serverTimestamp(),
  });
}

export async function saveMeeting(meeting: Record<string, unknown>) {
  const existing = readLocal<Record<string, unknown>[]>("meetings", []);
  writeLocal("meetings", [meeting, ...existing]);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) return;

  await addDoc(collection(db, "users", user.uid, "meetings"), {
    ...meeting,
    createdAt: serverTimestamp(),
  });
}

export async function saveAdvisorMessage(message: Record<string, unknown>) {
  const existing = readLocal<Record<string, unknown>[]>("advisorMessages", []);
  writeLocal("advisorMessages", [...existing, message]);

  const user = await ensureFirebaseUser();
  const db = getFirebaseDb();
  if (!user || !db) return;

  await addDoc(collection(db, "users", user.uid, "advisorMessages"), {
    ...message,
    createdAt: serverTimestamp(),
  });
}
