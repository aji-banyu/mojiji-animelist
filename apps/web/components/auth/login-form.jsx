"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { validateEmail } from "@/lib/validate";

const REMEMBER_EMAIL_KEY = "mojiji_remember_email";

export function LoginForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Muat email tersimpan setelah mount untuk mencegah mismatch hidrasi
  useEffect(() => {
    try {
      const savedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
      }
    } catch { }
  }, []);

  // Jika sudah login, jangan izinkan buka form login -> alihkan ke /home
  useEffect(() => {
    if (user) {
      router.replace("/home/");
    }
  }, [user, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");
    setInfoMessage("");

    const next = {
      email: validateEmail(email) || undefined,
      password: password ? undefined : "Isi passwordmu.",
    };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const result = await loginApi({
        email: trimmedEmail,
        password,
      });

      if (result.success) {
        try {
          if (remember) {
            window.localStorage.setItem(REMEMBER_EMAIL_KEY, trimmedEmail);
          } else {
            window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
          }
        } catch { }
        const userData = result.data?.user || result.data;
        useAuthStore.getState().login(userData);
        router.push("/home/");
      }
    } catch (err) {
      let errorMessage = "Email atau password salah. Coba lagi.";

      if (
        err?.isOffline ||
        err?.error?.code === "SERVER_OFFLINE" ||
        err?.message === "Network Error" ||
        !err?.status ||
        err?.status === 503
      ) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err?.status === 401) {
        errorMessage = err?.error?.message || "Email atau password salah. Coba lagi.";
      } else if (err?.status === 429) {
        errorMessage =
          err?.error?.message || "Terlalu banyak percobaan. Tunggu beberapa saat.";
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
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md bg-destructive/15 border border-destructive/25 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>{formError}</span>
          </div>
        )}
        {infoMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start justify-between gap-2 rounded-md bg-accent-soft border border-accent/30 p-3 text-sm text-text"
          >
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-text" strokeWidth={1.75} />
              <span>{infoMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setInfoMessage("")}
              aria-label="Tutup pemberitahuan"
              className="rounded p-0.5 text-text-2 hover:text-text cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((s) => ({ ...s, email: undefined }));
          }}
          error={errors.email}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((s) => ({ ...s, password: undefined }));
            }}
            error={errors.password}
          />
          <div className="mt-0.5 flex items-center justify-between">
            <Checkbox
              label="Ingat saya"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setInfoMessage(
                  "Fitur reset password belum tersedia saat ini. Silakan hubungi administrator atau buat akun baru."
                );
              }}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-accent-text hover:underline cursor-pointer"
            >
              Lupa password?
            </button>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Masuk
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-2">
        Belum punya akun?{" "}
        <Link
          href="/register/"
          className="inline-flex min-h-11 items-center font-semibold text-accent-text hover:underline cursor-pointer"
        >
          Daftar
        </Link>
      </p>
    </>
  );
}

