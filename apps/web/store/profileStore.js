import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Profile Store — Menyimpan data profil yang bersifat lokal (avatar, banner, bio).
 *
 * Karena backend belum mendukung upload gambar dan kolom bio,
 * data ini disimpan di localStorage per-user dan sinkron dengan authStore.
 */
const STORAGE_KEY = "mojiji_profile";

const DEFAULT_PROFILE = {
  bio: "",
  avatarUrl: "",
  bannerUrl: "",
  joinedAt: null,
};

const useProfileStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_PROFILE,

      // --- Actions ---
      setBio: (bio) => set({ bio: String(bio || "").slice(0, 160) }),

      setAvatarUrl: (url) => set({ avatarUrl: url || "" }),

      setBannerUrl: (url) => set({ bannerUrl: url || "" }),

      setJoinedAt: (date) => set({ joinedAt: date || null }),

      resetProfile: () => set({ ...DEFAULT_PROFILE }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

export default useProfileStore;
