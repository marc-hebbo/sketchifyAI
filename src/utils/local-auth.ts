"use client";

type StoredAccount = {
  email: string;
  name: string;
  password: string;
};

type StoredSession = {
  email: string;
  name: string;
};

const ACCOUNTS_KEY = "sketchify_local_accounts";
const SESSION_KEY = "sketchify_local_session";

const isBrowser = () => typeof window !== "undefined";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getStoredAccounts = (): StoredAccount[] => {
  if (!isBrowser()) return [];
  return safeParse<StoredAccount[]>(
    window.localStorage.getItem(ACCOUNTS_KEY),
    []
  );
};

export const upsertStoredAccount = (email: string, password: string) => {
  if (!isBrowser()) return null;

  const trimmedEmail = email.trim().toLowerCase();
  const name = trimmedEmail.split("@")[0] || "guest";
  const accounts = getStoredAccounts();
  const existingIndex = accounts.findIndex(
    (account) => account.email === trimmedEmail
  );

  const nextAccount = {
    email: trimmedEmail,
    name,
    password,
  };

  if (existingIndex >= 0) {
    accounts[existingIndex] = nextAccount;
  } else {
    accounts.push(nextAccount);
  }

  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return nextAccount;
};

export const setStoredSession = (email: string) => {
  if (!isBrowser()) return null;

  const trimmedEmail = email.trim().toLowerCase();
  const account = getStoredAccounts().find(
    (storedAccount) => storedAccount.email === trimmedEmail
  );

  if (!account) return null;

  const session: StoredSession = {
    email: account.email,
    name: account.name,
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getStoredSession = (): StoredSession | null => {
  if (!isBrowser()) return null;
  return safeParse<StoredSession | null>(
    window.localStorage.getItem(SESSION_KEY),
    null
  );
};

export const clearStoredSession = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
};
