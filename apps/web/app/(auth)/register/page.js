"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import GoogleButton from "@/components/auth/GoogleButton";
import PrimaryButton from "@/components/auth/PrimaryButton";

export default function RegisterPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // === State Form Register ===
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Jika sudah login, jangan izinkan buka form register -> alihkan ke /home
  useEffect(() => {
    if (user) {
      router.replace("/home");
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

  // === Fungsi Validasi Sisi Klien ===
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // 1. Validasi Username
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

    // 2. Validasi Email
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Format email tidak valid";
    } else if (trimmedEmail.length > 255) {
      newErrors.email = "Email maksimal 255 karakter";
    }

    // 3. Validasi Password
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    // 4. Validasi Konfirmasi Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password harus sama";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Handler Submit Pendaftaran ke Backend ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const result = await registerApi({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        setSuccessMessage("Akun berhasil dibuat! Mengalihkan ke halaman masuk...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
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
        errorMessage =
          err?.error?.message || "Username atau Email sudah terdaftar. Silakan gunakan yang lain.";
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
    <AuthLayout>
      <div className="w-full">
        {/* Header Teks Form: Tengah Presisi (Center) */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Daftar Akun Baru
          </h2>
        </div>

        {/* Form Register 4 Field */}
        <form noValidate onSubmit={handleSubmit} className="space-y-3.5">
          {/* Banner Pesan Sukses */}
          {successMessage && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/40 p-3 text-xs sm:text-sm text-emerald-300 shadow-md">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          {/* Banner Error Global */}
          {errors.general && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/60 bg-red-950/40 p-3 text-xs sm:text-sm text-red-300 shadow-md">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span className="leading-relaxed font-medium">{errors.general}</span>
            </div>
          )}

          {/* Field 1: Username (Sebelumnya Nama Lengkap) */}
          <InputField
            id="register-username"
            name="username"
            type="text"
            label="Username"
            placeholder="username kamu"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={User}
            required
            autoComplete="username"
            compact
          />

          {/* Field 2: Email */}
          <InputField
            id="register-email"
            name="email"
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            required
            autoComplete="email"
            compact
          />

          {/* Field 3: Password */}
          <InputField
            id="register-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            required
            autoComplete="new-password"
            compact
          />

          {/* Field 4: Konfirmasi Password */}
          <InputField
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            label="Konfirmasi Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
            required
            autoComplete="new-password"
            compact
          />

          {/* Tombol Utama Daftar Sekarang (Teks Center & Tanpa Ikon) */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
              compact
            >
              Daftar Sekarang
            </PrimaryButton>
          </div>
        </form>

        {/* Divider Garis Tipis "ATAU" (Opsi A) */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-[#1E293B]" />
          <span className="absolute bg-[#0B1220] px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            ATAU
          </span>
        </div>

        {/* Tombol Daftar dengan Google Berada di Bawah */}
        <div>
          <GoogleButton label="Daftar dengan Google" compact />
        </div>

        {/* Footer Navigasi ke Login */}
        <p className="mt-6 text-center text-sm sm:text-base text-slate-300">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-[#DC2626] hover:text-red-400 hover:underline ml-1 cursor-pointer"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
