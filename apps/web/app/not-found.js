import Link from "next/link";

export const metadata = { title: "Halaman Tidak Ditemukan · Mojiji" };

export default function NotFound() {
  return (
    <div
      data-not-found="true"
      className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-text"
    >
      <div className="text-center space-y-5 max-w-md">
        <p className="text-7xl sm:text-8xl font-black tracking-tight font-heading text-text select-none">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
          Halaman Tidak Ditemukan
        </h1>
        <div className="pt-1">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25 transition-all active:scale-95"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
