"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import AuthLayout from "@/components/auth/AuthLayout";
import InputField from "@/components/auth/InputField";
import GoogleButton from "@/components/auth/GoogleButton";
import PrimaryButton from "@/components/auth/PrimaryButton";

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // === State Form ===
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jika sudah login, jangan izinkan buka form login -> alihkan ke /home
  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  // === Handler: Update data saat pengguna mengetik ===
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  // === Fungsi Validasi Sisi Klien ===
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Handler Submit ke Backend Auth-Service ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await loginApi({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        const userData = result.data?.user || result.data;
        useAuthStore.getState().login(userData);
        router.push("/home");
      }
    } catch (err) {
      let errorMessage = "Gagal masuk. Silakan coba lagi.";

      if (
        err?.isOffline ||
        err?.error?.code === "SERVER_OFFLINE" ||
        err?.message === "Network Error" ||
        !err?.status ||
        err?.status === 503
      ) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err?.status === 401) {
        errorMessage = err?.error?.message || "Email atau password salah.";
      } else if (err?.status === 429) {
        errorMessage =
          err?.error?.message || "Terlalu banyak percobaan. Tunggu beberapa saat.";
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
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Masuk ke Akun
          </h2>
        </div>

        {/* Form Email & Password */}
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {/* Banner Error Global */}
          {errors.general && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/60 bg-red-950/40 p-4 text-xs sm:text-sm text-red-300 shadow-md">
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-400" />
              <span className="leading-relaxed font-medium">{errors.general}</span>
            </div>
          )}

          {/* Field Email */}
          <InputField
            id="login-email"
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
          />

          {/* Field Password */}
          <InputField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            required
            autoComplete="current-password"
          />

          {/* Baris Ingat Saya & Lupa Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-[#050A14] text-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/40 cursor-pointer accent-[#DC2626]"
              />
              <span className="text-sm text-slate-300 hover:text-white transition-colors">
                Ingat saya
              </span>
            </label>

            <Link
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Fitur lupa password sedang dalam pengembangan.");
              }}
              className="text-sm font-semibold text-[#DC2626] hover:text-red-400 hover:underline cursor-pointer"
            >
              Lupa password?
            </Link>
          </div>

          {/* Tombol Utama Masuk (Teks Center & Tanpa Ikon) */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              isLoading={isSubmitting}
            >
              Masuk Sekarang
            </PrimaryButton>
          </div>
        </form>

        {/* Divider Garis Tipis "ATAU" (Opsi A) */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="w-full border-t border-[#1E293B]" />
          <span className="absolute bg-[#0B1220] px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            ATAU
          </span>
        </div>

        {/* Tombol Masuk dengan Google Berada di Bawah */}
        <div>
          <GoogleButton label="Lanjutkan dengan Google" />
        </div>

        {/* Footer Navigasi ke Register */}
        <p className="mt-8 text-center text-sm sm:text-base text-slate-300">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-bold text-[#DC2626] hover:text-red-400 hover:underline ml-1 cursor-pointer"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
