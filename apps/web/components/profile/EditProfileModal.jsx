"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProfileStore from "@/store/profileStore";

/**
 * EditProfileModal — Modal sederhana untuk mengubah username (lokal) dan bio.
 */
export default function EditProfileModal({ open, onClose, user }) {
  const bio = useProfileStore((s) => s.bio);
  const setBio = useProfileStore((s) => s.setBio);

  const [localUsername, setLocalUsername] = useState(user?.username || "");
  const [localBio, setLocalBio] = useState(bio || "");
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLocalUsername(user?.username || "");
      setLocalBio(bio || "");
    }
  }, [open, user, bio]);

  // Tutup saat klik overlay
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Tutup saat tekan Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSave = () => {
    setBio(localBio.trim());
    // Username belum bisa diubah di backend, hanya bio disimpan di localStorage
    onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text font-heading tracking-tight">
            Edit Profil
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-2 hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={localUsername}
              disabled
              className="w-full h-11 rounded-xl border border-border bg-surface-2/50 px-3 text-sm text-text-3 cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-text-3">
              Username belum bisa diubah saat ini.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">
              Bio / Tagline
            </label>
            <textarea
              value={localBio}
              onChange={(e) => setLocalBio(e.target.value.slice(0, 160))}
              placeholder="Life is anime, trace or drop."
              maxLength={160}
              rows={3}
              className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/35 resize-none transition-all"
            />
            <p className="mt-0.5 text-right text-[11px] text-text-3">
              {localBio.length}/160
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button size="sm" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
