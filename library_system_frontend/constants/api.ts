import Constants from 'expo-constants';

function getExpoHostIp() {
  const constants = Constants as typeof Constants & {
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };

  const hostUri =
    Constants.expoConfig?.hostUri ||
    constants.manifest?.debuggerHost ||
    constants.manifest2?.extra?.expoClient?.hostUri;

  return hostUri?.split(':')[0];
}

function getDefaultApiBaseUrl() {
  const hostIp = getExpoHostIp();
  return hostIp ? `http://${hostIp}:8080` : 'http://localhost:8080';
}

const envApiBaseUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env?.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = envApiBaseUrl?.trim() || getDefaultApiBaseUrl();

export type BookStatus = 'AVAILABLE' | 'RESERVED' | 'BORROWED';

export type Book = {
  id: number;
  title: string;
  author: string;
  publisher?: string | null;
  category?: string | null;
  isbn?: string | null;
  imageurl?: string | null;
  status: BookStatus;
  reservedByUserId?: number | null;
};

export type User = {
  id: number;
  username: string;
  nickname: string;
  email: string;
};

export type Loan = {
  loanId: number;
  bookId: number;
  userId: number;
  bookTitle: string;
  bookAuthor: string;
  bookStatus: BookStatus;
  borrowedAt: string;
  returnedAt?: string | null;
  active: boolean;
};

export type Reservation = {
  reservationId: number;
  bookId: number;
  userId: number;
  bookTitle: string;
  bookAuthor: string;
  bookStatus: BookStatus;
  createdAt: string;
  active: boolean;
};

export type PopularBook = {
  bookId: number;
  title: string;
  author: string;
  publisher?: string | null;
  category?: string | null;
  isbn?: string | null;
  imageurl?: string | null;
  status: BookStatus;
  reservedByUserId?: number | null;
  loanCount: number;
  reservationCount: number;
  popularityScore: number;
};

type HealthResponse = {
  status: string;
  serverTime: string;
};

type ApiErrorResponse = {
  success?: boolean;
  data?: unknown;
  message?: string;
};

async function readErrorMessage(response: Response) {
  const text = await response.text();
  if (!text) return `API 요청 실패: ${response.status}`;

  try {
    const parsed = JSON.parse(text) as ApiErrorResponse;
    return parsed.message || text;
  } catch {
    return text;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body !== undefined && init.body !== null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function checkApiHealth() {
  return requestJson<HealthResponse>('/api/health');
}

export function searchBooks(query: string) {
  return requestJson<Book[]>(`/api/books/search?query=${encodeURIComponent(query)}`);
}

export function signup(payload: { username: string; nickname: string; email: string; password: string }) {
  return requestJson<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { username: string; password: string }) {
  return requestJson<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return requestJson<void>('/api/auth/logout', { method: 'POST' });
}

export function getMe() {
  return requestJson<User>('/api/users/me');
}

export function updateMe(payload: { nickname?: string; email?: string }) {
  return requestJson<User>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function reserveBook(bookId: number) {
  return requestJson<Reservation>(`/api/books/${bookId}/reserve`, { method: 'POST' });
}

export function cancelReservation(bookId: number) {
  return requestJson<Reservation>(`/api/books/${bookId}/reserve`, { method: 'DELETE' });
}

export function borrowBook(bookId: number) {
  return requestJson<Loan>(`/api/books/${bookId}/borrow`, { method: 'POST' });
}

export function returnBook(bookId: number) {
  return requestJson<Loan>(`/api/books/${bookId}/return`, { method: 'POST' });
}

export function getMyLoans() {
  return requestJson<Loan[]>('/api/books/me/loans');
}

export function getMyReservations() {
  return requestJson<Reservation[]>('/api/books/me/reservations');
}

export function getPopularBooks(limit = 20) {
  return requestJson<PopularBook[]>(`/api/books/popular?limit=${limit}`);
}
