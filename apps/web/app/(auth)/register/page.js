"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { registerApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // === State Form ===
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Jika sudah login, jangan izinkan buka form register -> alihkan ke /dashboard
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // === Handler: Update data saat pengguna mengetik ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  // === Fungsi Validasi Sisi Klien (Sesuai PRD US-007 & Zod Backend Syafii) ===
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Validasi Username — 3 hingga 50 karakter, alfanumerik & underscore
    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      newErrors.username = "Username wajib diisi";
    } else if (trimmedUsername.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (trimmedUsername.length > 50) {
      newErrors.username = "Username maksimal 50 karakter";
    } else if (!usernameRegex.test(trimmedUsername)) {
      newErrors.username = "Username hanya boleh huruf, angka, dan underscore (_)";
    }

    // Validasi Email — wajib diisi, format valid, maksimal 255 karakter
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Format email tidak valid";
    } else if (trimmedEmail.length > 255) {
      newErrors.email = "Email maksimal 255 karakter";
    }

    // Validasi Password — WAJIB minimal 8 karakter (aturan mutlak PRD US-007)
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    // Validasi Konfirmasi Password — harus sama persis dengan password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Handler: Saat form di-submit via API Layer ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Memanggil fungsi registerApi via Axios ke API Gateway (atau Mock jika USE_MOCK aktif)
      const result = await registerApi({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        // Registrasi berhasil -> alihkan ke /login sesuai Acceptance Criteria US-007
        router.push("/login");
      }
    } catch (err) {
      // Penanganan Kode Respon Error Spesifik
      let errorMessage = "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";

      if (
        err?.isOffline ||
        err?.error?.code === "SERVER_OFFLINE" ||
        err?.message === "Network Error" ||
        !err?.status ||
        err?.status === 503
      ) {
        errorMessage =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba beberapa saat lagi.";
      } else if (err?.status === 409) {
        errorMessage = err?.error?.message || "Username atau Email sudah terdaftar. Silakan gunakan yang lain.";
      } else if (err?.status === 429) {
        errorMessage =
          err?.error?.message ||
          "Terlalu banyak percobaan. Harap tunggu beberapa saat sebelum mencoba kembali.";
      } else if (err?.error?.details && Array.isArray(err.error.details)) {
        errorMessage = err.error.details
          .map((d) => (typeof d === "string" ? d : d.message || JSON.stringify(d)))
          .join(", ");
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      }

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* === Latar Belakang Gelap + Overlay === */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1015] to-[#000000]" />
      <div className="absolute inset-0 bg-[#0F1015]/60" />

      {/* === Logo Mojiji (Pojok Kiri Atas) === */}
      <div className="absolute left-6 top-5 z-10">
        <Link href="/" className="text-3xl font-bold tracking-tight text-[#FF4655]">
          MJ
        </Link>
      </div>

      {/* === Konten Form === */}
      <div className="relative z-10 w-full max-w-[400px] px-5 py-12">
        {/* Judul */}
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Buat Akun Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pesan Error Global / Banner Status Koneksi */}
          {errors.general && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-500/60 bg-red-950/50 p-3.5 text-xs text-red-300 shadow-md">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span className="leading-relaxed font-medium">{errors.general}</span>
            </div>
          )}

          {/* Field: Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Masukkan Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-lg border bg-[#181A20] px-4 py-3 text-sm font-medium text-white placeholder-[#9E9EA7] outline-none transition-colors ${errors.username
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/80 focus:border-[#FF4655]"
                }`}
            />
            {errors.username && (
              <p className="text-xs text-red-400">{errors.username}</p>
            )}
          </div>

          {/* Field: Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Masukkan Email..."
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-lg border bg-[#181A20] px-4 py-3 text-sm font-medium text-white placeholder-[#9E9EA7] outline-none transition-colors ${errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-white/80 focus:border-[#FF4655]"
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Field: Password (dengan ikon mata) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Password..."
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-[#181A20] px-4 py-3 pr-12 text-sm font-medium text-white placeholder-[#9E9EA7] outline-none transition-colors ${errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/80 focus:border-[#FF4655]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9EA7] hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Field: Konfirmasi Password (dengan ikon mata) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Konfirmasi Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan Password..."
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full rounded-lg border bg-[#181A20] px-4 py-3 pr-12 text-sm font-medium text-white placeholder-[#9E9EA7] outline-none transition-colors ${errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/80 focus:border-[#FF4655]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9EA7] hover:text-white"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#FF4655] py-3 text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        {/* Link ke Login */}
        <p className="mt-4 text-center text-sm font-semibold text-white">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#FF4655] hover:underline">
            Login di sini
          </Link>
        </p>

        {/* Pemisah "or" */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/40" />
          <span className="text-sm font-medium text-white">or</span>
          <div className="h-px flex-1 bg-white/40" />
        </div>

        {/* Tombol Daftar dengan Google */}
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-md border border-white/80 bg-[#181A20] px-4 py-3 text-sm font-semibold text-[#9E9EA7] transition-colors hover:border-white hover:text-white disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Daftar dengan Google
        </button>
      </div>
    </div>
  );
}
