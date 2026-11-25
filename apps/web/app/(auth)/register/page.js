import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Daftar · Mojiji" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mt-8 text-[28px] font-bold leading-tight text-text font-heading tracking-tight">
        Daftar
      </h1>
      <div className="mt-6">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-surface" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </>
  );
}
