"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const slides = [
  "/images/slide1.webp",
  "/images/slide2.webp",
  "/images/slide3.webp",
  "/images/slide4.webp",
];

export default function HomePage() {
  // State Slider Carousel (Aset dari Landing Page)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Timer otomatis pergantian slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5.25rem)] bg-[#0F1015] text-white">
        {/* ========================================================================= */}
        {/* FULL-WIDTH CINEMATIC HERO BANNER (Layout Full Edge-to-Edge)               */}
        {/* ========================================================================= */}
        <section className="relative w-full h-[calc(100vh-5.25rem)] min-h-[500px] overflow-hidden bg-black">
          {/* 4 Background Slides dengan Efek Crossfade Halus */}
          {slides.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}

          {/* Lapisan Gradasi: Film Gelap, Gradasi Kiri Teks, & Gradasi Bawah Melebur ke Halaman */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0F1015] via-[#0F1015]/80 via-35% to-transparent to-75%" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0F1015] via-[#0F1015]/75 to-transparent" />

          {/* Konten Hero (Sejajar dengan Max-W-5xl di tengah) */}
          <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-white drop-shadow-2xl leading-[1.12]">
                Perjalanan Dalam <br /> Satu Ruang
              </h1>

              <p className="text-sm sm:text-base text-neutral-200/95 leading-relaxed drop-shadow max-w-lg">
                Temukan anime favoritmu, lacak progres tontonan, dan ikuti episode terbaru setiap musimnya.
              </p>

              <div className="pt-2">
                <Link
                  href="/tracker"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-950/40 transition-all hover:bg-[#b91c1c] active:scale-95 cursor-pointer"
                >
                  <Bookmark size={16} />
                  <span>Buka Tracker Saya</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Indikator Titik (Dots) Slide Posisi Center di Bawah Banner */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? "w-8 bg-[#DC2626] shadow-md shadow-red-900/50"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
