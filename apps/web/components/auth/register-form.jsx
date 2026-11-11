"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { validateEmail, validatePassword, validateUsername } from "@/lib/validate";

export function RegisterForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [v, setV] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika sudah login, jangan izinkan buka form register -> alihkan ke /home
  useEffect(() => {
    if (user) {
      router.replace("/home/");
    }
  }, [user, router]);

  const bind = (k) => ({
    value: v[k],
    error: errors[k],
    onChange: (e) => {
      setV((s) => ({ ...s, [k]: e.target.value }));
      setErrors((s) => ({ ...s, [k]: undefined }));
      if (formError) setFormError("");
    },
  });

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const next = {
      username: validateUsername(v.username) || undefined,
      email: validateEmail(v.email) || undefined,
      password: validatePassword(v.password) || undefined,
    };
    setErrors(next);
    if (next.username || next.email || next.password) return;

    setLoading(true);
    try {
      const result = await registerApi({
        username: v.username.trim(),
        email: v.email.trim(),
        password: v.password,
      });

      if (result.success) {
        setSuccessMessage("Akun berhasil dibuat! Mengalihkan ke halaman masuk...");
        setTimeout(() => {
          router.push("/login/");
        }, 1200);
      }
    } catch (err) {
      let errorMessage = "Pendaftaran belum berhasil. Coba lagi sebentar.";

      if (
        err?.isOffline ||
        err?.error?.code === "SERVER_OFFLINE" ||
        err?.message === "Network Error" ||
        !err?.status ||
        err?.status === 503
      ) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: "Email atau username ini sudah terdaftar. Coba masuk.",
        }));
        return;
      } else if (err?.status === 429) {
        errorMessage = "Terlalu banyak percobaan. Tunggu beberapa saat.";
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      }

      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-md bg-success-soft p-3 text-sm text-success border border-success-border"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} />
            <span>{successMessage}</span>
          </div>
        )}
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md bg-destructive/15 border border-destructive/25 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>{formError}</span>
          </div>
        )}
        <Input
          label="Username"
          autoComplete="username"
          placeholder="username"
          {...bind("username")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          {...bind("email")}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            hint="Minimal 8 karakter."
            {...bind("password")}
          />
          <PasswordStrength value={v.password} />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Daftar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-2">
        Sudah punya akun?{" "}
        <Link
          href="/login/"
          className="inline-flex min-h-11 items-center font-semibold text-accent-text hover:underline cursor-pointer"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}

