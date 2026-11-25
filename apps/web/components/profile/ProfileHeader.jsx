"use client";

import { useRef, useState } from "react";
import { Camera, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useProfileStore from "@/store/profileStore";

/**
 * Utilitas: mengonversi File menjadi Data URL untuk disimpan di localStorage.
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Kompresi gambar agar tidak memakan ruang localStorage berlebih.
 * Maks lebar/tinggi 512px untuk avatar, 1200px untuk banner.
 */
function compressImage(dataUrl, maxSize = 512) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxSize || h > maxSize) {
        const ratio = Math.min(maxSize / w, maxSize / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = dataUrl;
  });
}

/**
 * ProfileHeader — Bagian atas halaman profil menampilkan banner, avatar, nama, bio,
 * dan tombol Edit Profile.
 */
export default function ProfileHeader({ user, onEditProfile }) {
  const avatarUrl = useProfileStore((s) => s.avatarUrl);
  const bannerUrl = useProfileStore((s) => s.bannerUrl);
  const bio = useProfileStore((s) => s.bio);
  const setAvatarUrl = useProfileStore((s) => s.setAvatarUrl);
  const setBannerUrl = useProfileStore((s) => s.setBannerUrl);

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(/[\s_]+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const compressed = await compressImage(dataUrl, 512);
      setAvatarUrl(compressed);
    } catch {
      // Silakan abaikan
    } finally {
      setAvatarLoading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const compressed = await compressImage(dataUrl, 1200);
      setBannerUrl(compressed);
    } catch {
      // Silakan abaikan
    } finally {
      setBannerLoading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "Maret 2026";

  return (
    <section className="relative">
      {/* ========== Banner ========== */}
      <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-accent/60 to-primary/40">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Banner profil"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent pointer-events-none" />

        {/* Tombol ubah banner */}
        <button
          type="button"
          onClick={() => bannerInputRef.current?.click()}
          disabled={bannerLoading}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-bg/60 backdrop-blur-sm text-text-2 hover:text-text hover:bg-bg/80 transition-all cursor-pointer border border-border/40"
          aria-label="Ubah banner profil"
        >
          <Camera size={14} />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />
      </div>

      {/* ========== Avatar + Info ========== */}
      <div className="relative -mt-14 sm:-mt-16 px-4 sm:px-6 flex items-end gap-4 sm:gap-5">
        {/* Avatar */}
        <div className="relative shrink-0 group">
          <div
            className={cn(
              "h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-bg overflow-hidden bg-surface-2 shadow-lg flex items-center justify-center select-none",
              avatarLoading && "animate-pulse"
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.username || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon size={40} className="text-text-3" strokeWidth={1.5} />
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarLoading}
            className="absolute bottom-0 right-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary-hover transition-colors cursor-pointer border-2 border-bg"
            aria-label="Ubah foto profil"
          >
            <Camera size={12} />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Nama, Bio, Tanggal */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight font-heading truncate">
              {user?.username || "Pengguna"}
            </h1>
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex items-center rounded-lg border border-border bg-surface hover:bg-surface-2 hover:border-border-hover px-3 py-1.5 text-xs font-semibold text-text transition-colors cursor-pointer select-none shadow-xs"
            >
              Edit Profile
            </button>
          </div>
          {bio && (
            <p className="mt-0.5 text-sm text-text-2 leading-snug truncate">
              {bio}
            </p>
          )}
          <p className="mt-0.5 text-xs text-text-3">
            Joined {joinedDate}
          </p>
        </div>
      </div>
    </section>
  );
}
