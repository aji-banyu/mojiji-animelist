import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Auth Store — Menyimpan data profil pengguna yang sedang login.
 *
 * ⚠️ ATURAN MUTLAK:
 * - JANGAN simpan token, JWT, atau session ID di store ini.
 * - Sesi sepenuhnya dikelola oleh cookie httpOnly dari backend.
 * - Store ini hanya menyimpan data profil non-sensitif untuk kebutuhan render UI.
 *
 * Sumber data: respons dari GET /api/users/me via API Gateway atau loginApi.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // --- State ---
      user: null, // { id, username, email } | null
      isLoading: false,

      // --- Actions ---
      login: (userData) =>
        set({
          user: {
            id: userData?.id || "usr_mock_123",
            username: userData?.username || "dika_dev",
            email: userData?.email || "dika@mojiji.com",
          },
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
    }),
    {
      name: "mojiji_auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
