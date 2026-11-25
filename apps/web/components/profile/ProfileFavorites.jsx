"use client";

import Link from "next/link";

/**
 * Data favorit mock — Di masa depan bisa diambil dari endpoint API favorit pengguna.
 */
const MOCK_FAVORITES = [
  {
    id: 51009,
    title: "Jujutsu Kaisen",
    image: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
    type: "anime",
  },
  {
    id: 38000,
    title: "Demon Slayer",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    type: "anime",
  },
  {
    id: 1535,
    title: "Death Note",
    image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    type: "anime",
  },
  {
    id: 44511,
    title: "Chainsaw Man",
    image: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    type: "anime",
  },
  {
    id: 52991,
    title: "Frieren",
    image: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    type: "anime",
  },
];

/**
 * ProfileFavorites — Grid kartu kecil anime/manga favorit pengguna.
 */
export default function ProfileFavorites() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-xs">
      <h3 className="text-sm font-bold text-text tracking-tight">Favorites</h3>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {MOCK_FAVORITES.map((fav) => (
          <Link
            key={fav.id}
            href={`/detail/?type=${fav.type}&id=${fav.id}`}
            className="group relative overflow-hidden rounded-lg aspect-[3/4] bg-surface-2"
          >
            <img
              src={fav.image}
              alt={fav.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay gelap di hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-x-0 bottom-0 p-1.5 text-[10px] leading-tight font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
              {fav.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
