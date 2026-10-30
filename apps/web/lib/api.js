/**
 * api.js — Pintu sentral pemanggilan API untuk aplikasi Mojiji AnimeList.
 *
 * Mengatur saklar antara mode Mock API (data tiruan lokal) dan API riil (API Gateway):
 * - Jika NEXT_PUBLIC_USE_MOCK="true"  ➔ Mengembalikan data tiruan dari lib/mock/ dengan jeda buatan.
 * - Jika NEXT_PUBLIC_USE_MOCK="false" ➔ Melakukan fetch() asli ke API Gateway dengan credentials: 'include'.
 *
 * Sesuai konvensi teknis: docs/architecture/frontend-technical-notes.md
 */

import {
  mockRegisterSuccess,
  mockLoginSuccess,
  mockLogoutSuccess,
  mockMeSuccess,
  mockLoginUnauthorized,
} from "@/lib/mock/authMock";

import {
  mockSearchAnime,
  mockSearchManga,
  mockAnimeDetail,
  mockMangaDetail,
  mockCatalogNotFound,
} from "@/lib/mock/catalogMock";

import {
  mockTrackerList,
  mockTrackerAddSuccess,
  mockTrackerUpdateStatus,
  mockTrackerIncrement,
  mockTrackerDeleteSuccess,
} from "@/lib/mock/trackerMock";

// Konfigurasi Environment (Default MOCK aktif selama fase MVP, kecuali dimatikan dengan nilai "false")
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Helper jeda waktu simulasi jaringan (400ms)
const simulateNetworkDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper internal untuk fetch riil ke API Gateway
 */
async function realFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Wajib: kirim cookie sesi httpOnly otomatis ke API Gateway
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorObj = data?.error || {
      code: "HTTP_ERROR",
      message: `Permintaan gagal dengan status ${response.status}`,
    };
    throw { success: false, error: errorObj, status: response.status };
  }

  return data;
}

// ============================================================
// 1. AUTHENTICATION & USER PROFILE
// ============================================================

/**
 * Registrasi pengguna baru
 * POST /api/auth/register
 */
export async function registerApi({ username, email, password }) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return {
      ...mockRegisterSuccess,
      data: {
        ...mockRegisterSuccess.data,
        username,
        email,
      },
    };
  }

  return realFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

/**
 * Login pengguna
 * POST /api/auth/login
 */
export async function loginApi({ email, password }) {
  if (USE_MOCK) {
    await simulateNetworkDelay();

    // Smart Mock: Validasi kredensial khusus dika@mojiji.com & andika123
    const isMatch =
      email?.trim() === mockLoginSuccess.data.email &&
      password === mockLoginSuccess.data.password;

    if (!isMatch) {
      throw {
        success: false,
        error: mockLoginUnauthorized.error,
        status: 401,
      };
    }

    return {
      success: true,
      data: {
        id: mockLoginSuccess.data.id,
        username: mockLoginSuccess.data.username,
        email: mockLoginSuccess.data.email,
      },
    };
  }

  return realFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Logout pengguna
 * POST /api/auth/logout
 */
export async function logoutApi() {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return mockLogoutSuccess;
  }

  return realFetch("/api/auth/logout", {
    method: "POST",
  });
}

/**
 * Ambil data sesi pengguna yang sedang login
 * GET /api/users/me
 */
export async function getMeApi() {
  if (USE_MOCK) {
    await simulateNetworkDelay(200);
    return mockMeSuccess;
  }

  return realFetch("/api/users/me", {
    method: "GET",
  });
}

// ============================================================
// 2. CATALOG (SEARCH & DETAIL ANIME/MANGA)
// ============================================================

/**
 * Pencarian anime atau manga
 * GET /api/catalog/search?q=...&type=...
 */
export async function searchCatalogApi({ q = "", type = "anime", page = 1, limit = 10 }) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return type === "manga" ? mockSearchManga : mockSearchAnime;
  }

  const queryParams = new URLSearchParams({
    q,
    type,
    page: String(page),
    limit: String(limit),
  });

  return realFetch(`/api/catalog/search?${queryParams.toString()}`, {
    method: "GET",
  });
}

/**
 * Detail anime atau manga berdasarkan MAL ID
 * GET /api/catalog/:type/:malId
 */
export async function getCatalogDetailApi(type, malId) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    if (type === "manga") return mockMangaDetail;
    return mockAnimeDetail;
  }

  return realFetch(`/api/catalog/${type}/${malId}`, {
    method: "GET",
  });
}

// ============================================================
// 3. PROGRESS TRACKER
// ============================================================

/**
 * Ambil daftar tracker milik user
 * GET /api/tracker?status=...
 */
export async function getTrackerListApi(status = "") {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    if (!status) return mockTrackerList;

    // Filter status jika parameter diberikan
    const filtered = mockTrackerList.data.filter((item) => item.status === status);
    return {
      success: true,
      data: filtered,
    };
  }

  const endpoint = status ? `/api/tracker?status=${encodeURIComponent(status)}` : "/api/tracker";
  return realFetch(endpoint, {
    method: "GET",
  });
}

/**
 * Tambah judul ke tracker
 * POST /api/tracker
 */
export async function addTrackerApi({ type, malId, status = "plan", progress = 0 }) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return {
      ...mockTrackerAddSuccess,
      data: {
        ...mockTrackerAddSuccess.data,
        media_type: type,
        mal_id: Number(malId),
        status,
        progress,
      },
    };
  }

  return realFetch("/api/tracker", {
    method: "POST",
    body: JSON.stringify({ type, malId: Number(malId), status, progress }),
  });
}

/**
 * Ubah status tracker
 * PATCH /api/tracker/:id/status
 */
export async function updateTrackerStatusApi(id, status) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return {
      ...mockTrackerUpdateStatus,
      data: {
        ...mockTrackerUpdateStatus.data,
        id,
        status,
      },
    };
  }

  return realFetch(`/api/tracker/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * Tambah progres +1
 * POST /api/tracker/:id/increment
 */
export async function incrementProgressApi(id) {
  if (USE_MOCK) {
    await simulateNetworkDelay(200);
    return {
      ...mockTrackerIncrement,
      data: {
        ...mockTrackerIncrement.data,
        id,
      },
    };
  }

  return realFetch(`/api/tracker/${id}/increment`, {
    method: "POST",
  });
}

/**
 * Hapus judul dari tracker
 * DELETE /api/tracker/:id
 */
export async function deleteTrackerApi(id) {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return mockTrackerDeleteSuccess;
  }

  return realFetch(`/api/tracker/${id}`, {
    method: "DELETE",
  });
}
