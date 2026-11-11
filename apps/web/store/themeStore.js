import { create } from "zustand";

export const THEME_STORAGE_KEY = "mojiji_theme";

function resolveInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Abaikan error penyimpanan jika browser membatasi localStorage
  }
}

const useThemeStore = create((set, get) => ({
  theme: "dark",

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyThemeToDocument(next);
    set({ theme: next });
  },

  setTheme: (value) => {
    const next = value === "light" ? "light" : "dark";
    applyThemeToDocument(next);
    set({ theme: next });
  },

  initTheme: () => {
    const resolved = resolveInitialTheme();
    applyThemeToDocument(resolved);
    set({ theme: resolved });
  },
}));

export default useThemeStore;
