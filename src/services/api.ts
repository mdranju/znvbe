/**
 * Centralized API service layer for all backend interactions.
 * All frontend pages should use these functions instead of calling axiosInstance directly.
 */
import axiosInstance from './axiosInstance';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    axiosInstance.post('/auth/login', credentials),

  register: (data: { name: string; email: string; password: string }) =>
    axiosInstance.post('/auth/register', data),

  forgotPassword: (email: string) =>
    axiosInstance.post('/auth/forget-password', { email }),

  verifyEmail: (data: { email: string; otp: string }) =>
    axiosInstance.post('/auth/verify-email', data),

  resetPassword: (data: { email: string; newPassword: string }) =>
    axiosInstance.post('/auth/reset-password', data),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    axiosInstance.post('/auth/change-password', data),
};

// ─── User / Profile ───────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => axiosInstance.get('/user/profile'),

  updateProfile: (data: { name?: string; address?: string }) =>
    axiosInstance.patch('/user/profile', data),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productApi = {
  getAll: (params?: Record<string, any>) =>
    axiosInstance.get('/product', { params: { status: 'active', ...params } }),

  getById: (id: string) => axiosInstance.get(`/product/${id}`),

  getRelated: (productId: string, categoryId: string) =>
    axiosInstance.get(`/product/related/${productId}/${categoryId}`),

  getFeatured: () =>
    axiosInstance.get('/product', {
      params: { status: 'active', isFeatured: true, limit: 8 },
    }),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoryApi = {
  getAll: (params?: Record<string, any>) =>
    axiosInstance.get('/category', {
      params: { status: 'active', ...params },
    }),

  getFeatured: () =>
    axiosInstance.get('/category', {
      params: { status: 'active', isFeatured: true },
    }),

  getById: (id: string) => axiosInstance.get(`/category/${id}`),
};

// ─── Banners ──────────────────────────────────────────────────────────────────

export const bannerApi = {
  getAll: (type?: 'hero' | 'cta' | 'poster') =>
    axiosInstance.get('/banner', {
      params: { status: 'active', ...(type ? { type } : {}) },
    }),

  getHero: () =>
    axiosInstance.get('/banner', {
      params: { status: 'active', type: 'hero' },
    }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orderApi = {
  create: (data: {
    items: {
      product: string;
      name: string;
      size: string;
      color?: string;
      quantity: number;
      price: number;
    }[];
    totalPrice: number;
    shippingCost: number;
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      district: string;
      phone: string;
      email: string;
    };
    paymentMethod: string;
    notes?: string;
  }) => axiosInstance.post('/order', data),

  getMyOrders: (params?: { limit?: number; page?: number }) =>
    axiosInstance.get('/order/my-orders', { params }),

  getById: (id: string) => axiosInstance.get(`/order/${id}`),

  track: (orderId: string, email: string) =>
    axiosInstance.get('/order/track', { params: { orderId, email } }),
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const addressApi = {
  getAll: () => axiosInstance.get('/address'),

  create: (data: {
    label: string;
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    district: string;
    postalCode?: string;
    phone: string;
    isDefault?: boolean;
  }) => axiosInstance.post('/address', data),

  update: (id: string, data: Partial<{
    label: string;
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    district: string;
    postalCode?: string;
    phone: string;
    isDefault?: boolean;
  }>) => axiosInstance.patch(`/address/${id}`, data),

  delete: (id: string) => axiosInstance.delete(`/address/${id}`),

  setDefault: (id: string) => axiosInstance.patch(`/address/${id}/default`, {}),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  getAll: () => axiosInstance.get('/wishlist'),
  add: (productId: string) =>
    axiosInstance.post('/wishlist', { product: productId }),
  remove: (productId: string) =>
    axiosInstance.delete(`/wishlist/${productId}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => axiosInstance.post('/contact', data),
};

// ─── Complaint ────────────────────────────────────────────────────────────────

export const complaintApi = {
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    orderNumber?: string;
    issueType: string;
    message: string;
  }) => axiosInstance.post('/complaint', data),
};

// ─── Affiliate ────────────────────────────────────────────────────────────────

export const affiliateApi = {
  apply: (data: {
    name: string;
    email: string;
    phone: string;
    platform: string;
    followers: string;
  }) => axiosInstance.post('/affiliate', data),
};

// ─── Helper: extract data from API response ───────────────────────────────────

export function extractData<T>(response: { data: any }): T {
  return response?.data?.data ?? response?.data;
}
