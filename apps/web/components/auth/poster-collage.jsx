"use client";

import { useState } from "react";

const POSTERS = [
  {
    title: "Apothecary Diaries",
    image: "https://cdn.myanimelist.net/images/anime/1708/138033.jpg",
  },
  {
    title: "Attack on Titan",
    image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
  },
  {
    title: "Jujutsu Kaisen",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
  },
  {
    title: "Naruto",
    image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
  },
  {
    title: "Spy x Family",
    image: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
  },
  {
    title: "Demon Slayer",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
  },
  {
    title: "Chainsaw Man",
    image: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
  },
  {
    title: "Death Note",
    image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
  },
  {
    title: "One Piece",
    image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
  },
  {
    title: "Steins;Gate",
    image: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
  },
  {
    title: "Hunter x Hunter",
    image: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
  },
];

function Tile({ title, image }) {
  const [bad, setBad] = useState(false);

  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-surface shadow-md group">
      {!bad && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          loading="eager"
          onError={() => setBad(true)}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Overlay gradien halus agar teks terbaca jelas dan selaras dengan background tema */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/25 to-transparent pointer-events-none" />
      <span className="absolute inset-x-3 bottom-3 font-heading text-xs font-semibold leading-tight text-text drop-shadow">
        {title}
      </span>
    </div>
  );
}

const DURATION = [46, 58, 52];
const OFFSET = ["-mt-6", "-mt-24", "-mt-12"];

// Dekoratif saja, jadi disembunyikan dari pembaca layar.
export function PosterCollage() {
  return (
    <div aria-hidden className="absolute inset-0 grid grid-cols-3 gap-4 px-6 opacity-85 pointer-events-none select-none">
      {[0, 1, 2].map((c) => (
        <div
          key={c}
          className={`collage-col grid content-start gap-4 ${OFFSET[c]}`}
          style={{
            animationDuration: `${DURATION[c]}s`,
            animationDirection: c === 1 ? "alternate-reverse" : "alternate",
          }}
        >
          {[0, 1, 2, 3].map((r) => {
            const p = POSTERS[(c * 3 + r) % POSTERS.length];
            return <Tile key={r} {...p} />;
          })}
        </div>
      ))}
    </div>
  );
}
