"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { validateEmail } from "@/lib/validate";

export function LoginForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika sudah login, jangan izinkan buka form login -> alihkan ke /home
  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");

    const next = {
      email: validateEmail(email) || undefined,
      password: password ? undefined : "Isi passwordmu.",
    };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      const result = await loginApi({
        email: email.trim(),
        password,
      });

      if (result.success) {
        const userData = result.data?.user || result.data;
        useAuthStore.getState().login(userData);
        router.push("/home");
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
            className="flex items-start gap-2 rounded-md bg-[#EC5D74]/15 border border-[#EC5D74]/25 p-3 text-sm text-[#EC5D74]"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>{formError}</span>
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
            <Link
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Fitur lupa password sedang dalam pengembangan.");
              }}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-[#A9A6F7] hover:underline"
            >
              Lupa password?
            </Link>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Masuk
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[#A5AAC0]">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center font-semibold text-[#A9A6F7] hover:underline cursor-pointer"
        >
          Daftar
        </Link>
      </p>
    </>
  );
}

