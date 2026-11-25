import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Masuk · Mojiji" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mt-8 text-[28px] font-bold leading-tight text-text font-heading tracking-tight">
        Masuk
      </h1>
      <div className="mt-6">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-surface" />}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
