/**
 * Tout là API client — cookie httpOnly Secure only
 * Auth via httpOnly cookie (plus de Bearer en localStorage).
 * Toutes les requêtes authentifiées utilisent `credentials: 'include'`.
 */
// En dev (vite proxy /api -> 127.0.0.1:8000) on utilise URL relative pour rester same-origin
// et éviter le piège SameSite cross-site (localhost:3000 -> 127.0.0.1:8000).
// En prod, définir VITE_API_URL (ex: https://api.lecouloir.ci)
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
  };
  // Ne jamais envoyer Authorization manuel — cookie httpOnly only
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
    credentials: 'include', // envoie / reçoit cookie httpOnly
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API ${res.status} ${path}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// -- Products
export interface FetchProductsParams {
  category?: string;
  search?: string;
  maxPrice?: number;
  sortBy?: string;
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
}
export async function fetchProducts(params: FetchProductsParams = {}) {
  const qs = new URLSearchParams();
  if (params.category && params.category !== 'Tous') qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice));
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.inStockOnly) qs.set('inStockOnly', 'true');
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  const q = qs.toString() ? `?${qs}` : '';
  return apiFetch(`/api/products${q}`) as Promise<{ items: import('../types').Product[]; total: number; page: number; limit: number }>;
}

export async function fetchProduct(id: string) {
  return apiFetch(`/api/products/${id}`) as Promise<{ product: import('../types').Product; similar: import('../types').Product[] }>;
}

// -- Categories
export async function fetchCategories() {
  return apiFetch('/api/categories') as Promise<{ id: string; label: string; product_count: number }[]>;
}

// -- Auth (cookie httpOnly)
export async function register(payload: { firstName: string; lastName: string; email: string; password: string; phone?: string }) {
  return apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ user: import('../types').UserProfile & { id: string; role: string } }>;
}
export async function login(payload: { email: string; password: string }) {
  return apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ user: import('../types').UserProfile & { id: string; role: string } }>;
}
export async function logout() {
  return apiFetch('/api/auth/logout', { method: 'POST' });
}
export async function fetchMe() {
  return apiFetch('/api/auth/me') as Promise<import('../types').UserProfile & { id: string; role: string }>;
}
export async function fetchMeAlt() {
  // alias /api/users/me (même cookie)
  return apiFetch('/api/users/me') as Promise<import('../types').UserProfile & { id: string; role: string }>;
}
export async function updateMe(payload: Partial<import('../types').UserProfile>) {
  return apiFetch('/api/users/me', { method: 'PUT', body: JSON.stringify(payload) });
}

// -- Orders (guest ok, auth via cookie si connecté)
export async function createOrder(payload: {
  fullName?: string;
  customer?: { fullName: string; phone: string; email?: string };
  phone?: string;
  email?: string;
  city: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: { productId: string; quantity: number; selectedColor?: string }[];
}) {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchOrders(status?: string) {
  const qs = status && status !== 'all' ? `?status=${status}` : '';
  return apiFetch(`/api/orders${qs}`);
}
export async function fetchMyOrders() {
  return apiFetch('/api/orders/my');
}
export async function updateOrderStatus(orderId: string, status: string) {
  return apiFetch(`/api/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}
export async function fetchAdminStats() {
  return apiFetch('/api/admin/stats') as Promise<{ ordersCount: number; revenue: number; productsCount: number; categoriesCount: number }>;
}

// -- Admin products
export async function createProduct(payload: any) {
  return apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) });
}
export async function updateProduct(id: string, payload: any) {
  return apiFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}
export async function deleteProduct(id: string) {
  return apiFetch(`/api/products/${id}`, { method: 'DELETE' });
}

// -- Admin categories
export async function createCategory(label: string) {
  return apiFetch('/api/categories', { method: 'POST', body: JSON.stringify({ label }) });
}
export async function deleteCategory(id: string) {
  return apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
}

export { BASE_URL };
