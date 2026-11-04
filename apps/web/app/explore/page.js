"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Star, Film, BookOpen, Sparkles, Filter } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const EXPLORE_ITEMS = [
  {
    id: 20,
    type: "anime",
    title: "Naruto",
    japanese: "NARUTO -ナルト-",
    score: 8.0,
    episodes: "220 Eps",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    highlight: "Shounen Klasik Populer",
  },
  {
    id: 54492,
    type: "anime",
    title: "Kusuriya no Hitorigoto",
    japanese: "薬屋のひとりごと",
    score: 8.9,
    episodes: "24 Eps",
    genres: ["Drama", "Mystery", "Historical"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/1708/138033.jpg",
    highlight: "Top Rated Season",
  },
  {
    id: 1,
    type: "manga",
    title: "Monster",
    japanese: "MONSTER",
    score: 9.1,
    episodes: "162 Ch",
    genres: ["Drama", "Mystery", "Psychological"],
    status: "Finished",
    image: "https://cdn.myanimelist.net/images/anime/10/18740.jpg",
    highlight: "Masterpiece Seinen",
  },
  {
    id: 16498,
    type: "anime",
    title: "Attack on Titan",
    japanese: "進撃の巨人",
    score: 8.5,
    episodes: "25 Eps",
    genres: ["Action", "Drama", "Suspense"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    highlight: "Aksi Fenomenal",
  },
  {
    id: 52991,
    type: "anime",
    title: "Sousou no Frieren",
    japanese: "葬送のフリーレン",
    score: 9.3,
    episodes: "28 Eps",
    genres: ["Adventure", "Drama", "Fantasy"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/1015/138075.jpg",
    highlight: "Peringkat #1 MAL",
  },
  {
    id: 40748,
    type: "anime",
    title: "Jujutsu Kaisen",
    japanese: "呪術廻戦",
    score: 8.6,
    episodes: "24 Eps",
    genres: ["Action", "Fantasy", "Supernatural"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    highlight: "Aksi Supernatural",
  },
  {
    id: 38000,
    type: "anime",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japanese: "鬼滅の刃",
    score: 8.5,
    episodes: "26 Eps",
    genres: ["Action", "Fantasy", "Historical"],
    status: "Finished Airing",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    highlight: "Visual Ufotable",
  },
  {
    id: 21,
    type: "anime",
    title: "One Piece",
    japanese: "ONE PIECE",
    score: 8.7,
    episodes: "1100+ Eps",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "Currently Airing",
    image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    highlight: "Petualangan Legendaris",
  },
  {
    id: 2,
    type: "manga",
    title: "Berserk",
    japanese: "ベルセルク",
    score: 9.5,
    episodes: "364 Ch",
    genres: ["Action", "Adventure", "Dark Fantasy"],
    status: "On Hiatus",
    image: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
    highlight: "Legenda Dark Fantasy",
  },
  {
    id: 11,
    type: "manga",
    title: "Chainsaw Man",
    japanese: "チェンソーマン",
    score: 8.7,
    episodes: "160+ Ch",
    genres: ["Action", "Supernatural", "Gore"],
    status: "Publishing",
    image: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    highlight: "Modern Shounen Hit",
  },
];

const GENRES = ["All", "Action", "Adventure", "Fantasy", "Drama", "Mystery", "Supernatural"];

export default function ExplorePage() {
  const [selectedType, setSelectedType] = useState("all"); // "all" | "anime" | "manga"
  const [selectedGenre, setSelectedGenre] = useState("All");

  const filteredItems = EXPLORE_ITEMS.filter((item) => {
    const matchType = selectedType === "all" || item.type === selectedType;
    const matchGenre =
      selectedGenre === "All" || item.genres.includes(selectedGenre);
    return matchType && matchGenre;
  });

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5rem)] bg-[#0A0E17] text-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-400 border border-violet-500/20">
              <Compass size={14} />
              <span>Discovery Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Eksplorasi Katalog Anime & Manga
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
              Temukan rekomendasi judul terpopuler, jelajahi berbagai genre pilihan, dan simpan judul favoritmu langsung ke tracker.
            </p>
          </div>

          {/* Filter Bar: Tipe & Genre */}
          <div className="flex flex-col gap-4 rounded-2xl border border-[#1E293B] bg-[#0F172A]/80 p-4 sm:p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            {/* Tipe Selector: All / Anime / Manga */}
            <div className="flex items-center gap-1 rounded-xl bg-[#0B1222] p-1 border border-[#334155]/40">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedType === "all"
                    ? "bg-[#6D4AFF] text-white shadow-md shadow-violet-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("anime")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedType === "anime"
                    ? "bg-[#6D4AFF] text-white shadow-md shadow-violet-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Film size={14} />
                <span>Anime</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("manga")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedType === "manga"
                    ? "bg-[#6D4AFF] text-white shadow-md shadow-violet-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <BookOpen size={14} />
                <span>Manga</span>
              </button>
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter size={15} className="text-slate-400 mr-1 hidden sm:block" />
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? "bg-white text-black font-bold shadow-sm"
                      : "bg-[#1E293B]/60 text-slate-300 hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Katalog Rekomendasi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-400">
              <span>Menampilkan {filteredItems.length} judul rekomendasi</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={`/detail?type=${item.type}&id=${item.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121622] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#6D4AFF]/60 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  {/* Poster */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge Highlight di Pojok Kiri Atas */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-400/20">
                        {item.highlight}
                      </span>
                    </div>

                    {/* Gradient & Rating Bawah */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-2.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star size={12} className="fill-amber-400" />
                          <span>{item.score.toFixed(1)}</span>
                        </span>
                        <span className="rounded bg-black/60 px-1.5 py-0.5 text-neutral-300 backdrop-blur-sm">
                          {item.episodes}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <h3
                        className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#6D4AFF]"
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                      <p className="line-clamp-1 text-xs text-neutral-400 mt-0.5">
                        {item.genres.join(", ")}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
                      <span className="capitalize text-slate-300">{item.type}</span>
                      <span className="text-emerald-400 font-semibold">{item.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

