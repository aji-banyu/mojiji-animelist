import { create } from "zustand";

/**
 * Auth Store — Menyimpan data profil pengguna yang sedang login.
 *
 * ⚠️ ATURAN MUTLAK:
 * - JANGAN simpan token, JWT, atau session ID di store ini.
 * - Sesi sepenuhnya dikelola oleh cookie httpOnly dari backend.
 * - Store ini hanya menyimpan data profil non-sensitif untuk kebutuhan render UI.
 *
 * Sumber data: respons dari GET /api/users/me via API Gateway.
 */
const useAuthStore = create((set) => ({
  // --- State ---
  user: null, // { id, username } | null
  isLoading: false,

  // --- Derived (getter helper) ---
  // Gunakan: useAuthStore((s) => s.user !== null) untuk cek login

  // --- Actions ---
  login: (userData) =>
    set({
      user: { id: userData.id, username: userData.username },
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isLoading: false,
    }),

  setLoading: (value) =>
    set({
      isLoading: value,
    }),
}));

export default useAuthStore;

