import { auth } from './firebase';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Função utilitária para requisições com injeção automática do Firebase ID Token se o usuário estiver autenticado
 */
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Se o usuário estiver autenticado no Firebase, obtém o token JWT atualizado
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.warn('Não foi possível obter o token de autenticação:', err);
    }
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    console.error(`Erro de rede ao acessar ${endpoint}:`, err);
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.error || `Erro na requisição: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  // --- Produtos ---
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category_id) query.append('category_id', params.category_id);
    if (params.featured !== undefined) query.append('featured', params.featured);
    if (params.available !== undefined) query.append('available', params.available);
    if (params.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/products${qs}`);
  },

  getProductById: (id) => request(`/products/${id}`),

  createProduct: (productData) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  toggleProductStatus: (id, statusData) =>
    request(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    }),

  deleteProduct: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),

  // --- Categorias ---
  getCategories: () => request('/categories'),

  createCategory: (name) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  updateCategory: (id, name) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // --- Vendas (Manual no Neon) ---
  createSale: (saleData) =>
    request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    }),

  getSales: (params = {}) => {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/sales${qs}`);
  },

  getSaleById: (id) => request(`/sales/${id}`),

  deleteSale: (id) =>
    request(`/sales/${id}`, {
      method: 'DELETE',
    }),

  // --- Dashboard ---
  getDashboardStats: () => request('/dashboard/stats'),

  // --- Configurações da Loja ---
  getSettings: () => request('/settings'),

  updateSettings: (settingsData) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }),
};
