import { create } from "zustand";

/**
 * Theme Store — Mengatur tema tampilan (terang / gelap).
 *
 * Tema disimpan di localStorage agar preferensi pengguna bertahan
 * meskipun halaman di-refresh. Nilai default mengikuti preferensi
 * sistem operasi pengguna.
 */
const useThemeStore = create((set) => ({
  // --- State ---
  // "light" | "dark"
  theme:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",

  // --- Actions ---
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";

      // Simpan preferensi ke localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("mojiji-theme", next);
      }

      return { theme: next };
    }),

  setTheme: (value) => {
    if (value !== "light" && value !== "dark") return;

    if (typeof window !== "undefined") {
      localStorage.setItem("mojiji-theme", value);
    }

    set({ theme: value });
  },

  /**
   * Panggil sekali saat aplikasi dimuat (misal di layout.js)
   * untuk memuat preferensi tema dari localStorage.
   */
  initTheme: () =>
    set(() => {
      if (typeof window === "undefined") return { theme: "light" };

      const saved = localStorage.getItem("mojiji-theme");
      if (saved === "light" || saved === "dark") return { theme: saved };

      // Fallback ke preferensi sistem
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return { theme: prefersDark ? "dark" : "light" };
    }),
}));

export default useThemeStore;

