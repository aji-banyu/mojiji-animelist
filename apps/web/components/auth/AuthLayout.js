"use client";

import Image from "next/image";
import Link from "next/link";

const animePosters = [
  { title: "Naruto", img: "https://cdn.myanimelist.net/images/anime/13/17405.jpg" },
  { title: "Attack on Titan", img: "https://cdn.myanimelist.net/images/anime/10/47347.jpg" },
  { title: "Frieren", img: "https://cdn.myanimelist.net/images/anime/1015/138075.jpg" },
  { title: "Apothecary Diaries", img: "https://cdn.myanimelist.net/images/anime/1708/138033.jpg" },
  { title: "Jujutsu Kaisen", img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg" },
  { title: "Demon Slayer", img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg" },
  { title: "One Piece", img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg" },
  { title: "Solo Leveling", img: "https://cdn.myanimelist.net/images/anime/1170/124305.jpg" },
  { title: "Chainsaw Man", img: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg" },
  { title: "Bleach", img: "https://cdn.myanimelist.net/images/anime/3/40451.jpg" },
  { title: "Hunter x Hunter", img: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg" },
  { title: "Monster", img: "https://cdn.myanimelist.net/images/anime/10/18740.jpg" },
  { title: "Death Note", img: "https://cdn.myanimelist.net/images/anime/9/9453.jpg" },
  { title: "Spy x Family", img: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg" },
  { title: "Fullmetal Alchemist", img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" },
  { title: "Vinland Saga", img: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-[#0B1220] text-white [font-family:var(--font-inter)] selection:bg-[#FF2D2D] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. PANEL KIRI: VISUAL & BRANDING (±42% Lebar pada Layar Desktop)          */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col justify-between p-12 xl:p-16 select-none bg-[#080D18]">
        {/* Kolase Poster Anime Diagonal Miring (-13deg) */}
        <div
          className="absolute -inset-24 flex items-center justify-center pointer-events-none transform -rotate-[13deg] scale-110 xl:scale-125 opacity-40"
          aria-hidden="true"
        >
          <div className="grid grid-cols-4 gap-4 w-[140%] max-w-none">
            {animePosters.map((poster, idx) => (
              <div
                key={idx}
                className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster.img}
                  alt={poster.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Lapisan Gradient Overlay Sinematik: Merah Marun Atas-Kiri & Navy Gelap Pekat di Bawah */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#7f1d1d]/75 via-[#0B1220]/70 to-[#0B1220]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-96 pointer-events-none bg-gradient-to-t from-[#0B1220] via-[#0B1220]/90 to-transparent"
          aria-hidden="true"
        />

        {/* Logo Mojiji di Pojok Kiri Atas */}
        <div className="relative z-10">
          <Link
            href="/home"
            className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/logo_mojiji.png"
              alt="Logo Mojiji"
              width={36}
              height={26}
              className="h-7 w-auto drop-shadow-md"
              priority
            />
            <span className="text-2xl font-black tracking-tight text-white drop-shadow">
              Mojiji
            </span>
          </Link>
        </div>

        {/* Heading & Deskripsi di Bagian Bawah Panel */}
        <div className="relative z-10 space-y-4 max-w-[480px]">
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.12] drop-shadow-xl">
            Selamat Datang <br /> di Mojiji!
          </h1>
          <p className="text-base xl:text-lg text-slate-300 leading-relaxed drop-shadow">
            Tempat terbaik untuk melacak anime dan manga subtitle Indonesia favoritmu dengan cepat dan nyaman.
          </p>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. PANEL KANAN: FORM AUTENTIKASI (±58% Lebar pada Layar Desktop)          */}
      {/* ========================================================================= */}
      <section className="w-full lg:w-[58%] min-h-screen bg-[#0B1220] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-12 relative overflow-y-auto">
        {/* Logo Khusus Mobile / Tablet (<1024px) */}
        <div className="lg:hidden mb-8 flex justify-center">
          <Link href="/home" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo_mojiji.png"
              alt="Logo Mojiji"
              width={36}
              height={26}
              className="h-7 w-auto"
              priority
            />
            <span className="text-2xl font-black tracking-tight text-white">
              Mojiji
            </span>
          </Link>
        </div>

        {/* Container Form (Maksimal Lebar ±560px, Rata Kiri di Desktop) */}
        <div className="w-full max-w-[560px] mx-auto lg:mx-0">
          {children}
        </div>
      </section>
    </div>
  );
}

