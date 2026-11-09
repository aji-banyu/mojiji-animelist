import Image from "next/image";
import Link from "next/link";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { PosterCollage } from "@/components/auth/poster-collage";

// Layout ini tidak dimuat ulang saat pindah Masuk <-> Daftar, jadi penanda tab bisa bergeser halus.
export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-dvh md:grid-cols-2 bg-[#16171B] text-[#ECEEF6] selection:bg-[#6B68C6]/30 selection:text-[#ECEEF6] font-sans">
      <aside className="relative hidden overflow-hidden border-r border-[#2B2D38] bg-[#16171B] md:block select-none">
        <PosterCollage />

        {/* Vignette atas agar logo kontras dan tidak bentrok dengan poster */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#16171B]/95 via-[#16171B]/60 to-transparent pointer-events-none z-10" />

        {/* Gradien fade bawah untuk tagline */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16171B] via-[#16171B]/60 to-transparent pointer-events-none z-10" />

        {/* Logo Mojiji di pojok kiri atas (polos, terlindungi vignette gelap) */}
        <Link
          href="/home"
          className="absolute left-12 top-10 z-20 flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/images/logo_mojiji.png"
            alt="Logo Mojiji"
            width={36}
            height={26}
            className="h-7 w-auto drop-shadow-md"
            priority
          />
          <span className="font-heading text-2xl font-black tracking-tight text-white drop-shadow">
            Mojiji
          </span>
        </Link>

        {/* Tagline santai & ramah di bagian kiri bawah */}
        <div className="absolute inset-x-12 bottom-12 pointer-events-none z-20">
          <h2 className="max-w-[15ch] font-heading text-[clamp(30px,3.2vw,38px)] font-bold leading-[1.1] text-[#ECEEF6] drop-shadow-lg">
            Lupa kemarin nonton sampai mana?
          </h2>
          <p className="mt-3 text-base text-[#A5AAC0] drop-shadow">
            Catat di Mojiji. Tinggal klik, langsung beres!
          </p>
        </div>
      </aside>

      <section className="flex flex-col items-center justify-start pt-10 sm:pt-14 md:pt-16 lg:pt-20 px-5 pb-12 min-h-dvh overflow-y-auto bg-[#16171B]">
        <div className="w-full max-w-sm">
          {/* Logo Mojiji khusus mobile / small screen */}
          <Link
            href="/home"
            className="mb-8 flex items-center justify-center sm:justify-start gap-3 font-heading text-2xl font-black tracking-tight text-white md:hidden hover:opacity-90 transition-opacity"
          >
            <Image
              src="/images/logo_mojiji.png"
              alt="Logo Mojiji"
              width={36}
              height={26}
              className="h-7 w-auto drop-shadow-md"
              priority
            />
            <span>Mojiji</span>
          </Link>
          <AuthTabs />
          {children}
        </div>
      </section>
    </main>
  );
}
