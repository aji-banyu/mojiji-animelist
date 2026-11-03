"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

const slides = [
  "/images/slide1.webp",
  "/images/slide2.webp",
  "/images/slide3.webp",
  "/images/slide4.webp",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer otomatis berganti slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Jika sudah login arahkan ke dashboard, jika belum ke login
  const targetHref = mounted && user ? "/dashboard" : "/login";

  return (
    <main className="relative flex h-screen w-full flex-col justify-center overflow-hidden bg-black px-6 sm:px-12 md:px-16 lg:px-24">
      {/* 4 Background Slides dengan Efek Crossfade Halus */}
      {slides.map((src, idx) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Lapisan gradasi terukur:
          1. Overlay film tipis 15% agar slide terang tidak silau tanpa menutupi artwork anime
          2. Gradasi sisi kiri hingga 50% layout agar teks tetap kontras di atas slide terang (seperti Eren)
          3. Gradasi sisi bawah hingga 35% layout untuk pijakan navigasi slide */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 via-30% to-transparent to-50% sm:via-black/55 sm:via-25% sm:to-50%" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/80 via-black/40 via-25% to-transparent" />

      {/* Konten Hero (Tanpa Logo MJ sesuai arahan) */}
      <div className="relative z-10 max-w-2xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-[3.9rem] lg:leading-[1.12]">
          Perjalanan Dalam <br /> Satu Ruang
        </h1>

        <p className="mt-5 max-w-xl font-serif text-base leading-relaxed text-gray-200/95 drop-shadow-lg sm:mt-6 sm:text-lg lg:text-[1.15rem]">
          Temukan anime favoritmu, lacak progres tontonan, dan ikuti episode terbaru setiap musimnya.
        </p>

        <div className="mt-8 sm:mt-9">
          <Link
            href={targetHref}
            className="inline-flex min-w-[230px] sm:min-w-[260px] items-center justify-center rounded-xl border border-white/90 bg-black/50 px-14 py-3 text-center text-base font-bold text-white shadow-xl backdrop-blur-md transition-all duration-300 ease-out hover:border-[#FF4655] hover:bg-[#FF4655] hover:shadow-lg hover:shadow-[#FF4655]/40 active:scale-95"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>

      {/* 4 Bullet Indicators di bagian bawah */}
      <div className="absolute bottom-8 left-6 z-20 flex items-center gap-2.5 sm:left-12 md:left-16 lg:left-24">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Pindah ke slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx
                ? "w-8 bg-white shadow-md shadow-white/40"
                : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>
    </main>
  );
}
