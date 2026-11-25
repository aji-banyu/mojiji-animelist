"use client";

import { MessageSquare, Star } from "lucide-react";

/**
 * ProfileReviews — Tab Reviews (placeholder dengan desain selaras).
 * Fitur lengkap review belum tersedia dari backend.
 */

const MOCK_REVIEWS = [
  {
    id: "rev_1",
    title: "Jujutsu Kaisen",
    malId: 51009,
    type: "anime",
    image: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
    score: 9,
    excerpt:
      "Aksi brutal dan karakter yang sangat kuat. Salah satu shonen terbaik dekade ini. Animasi dari MAPPA sungguh luar biasa, terutama pada arc Shibuya.",
    date: "2026-10-20",
  },
  {
    id: "rev_2",
    title: "Frieren: Beyond Journey's End",
    malId: 52991,
    type: "anime",
    image: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    score: 10,
    excerpt:
      "Sebuah mahakarya tentang waktu, kenangan, dan apa artinya hidup. Penceritaan yang lambat tapi begitu menghanyutkan. Wajib tonton.",
    date: "2026-09-15",
  },
];

export default function ProfileReviews() {
  return (
    <div className="space-y-4">
      {MOCK_REVIEWS.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <img
              src={review.image}
              alt={review.title}
              className="shrink-0 w-14 h-20 rounded-lg object-cover bg-surface-2"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-text truncate">
                  {review.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-score-bg">
                  <Star size={12} className="fill-score-bg" />
                  <span className="font-bold">{review.score}/10</span>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-text-2 leading-relaxed line-clamp-2">
                {review.excerpt}
              </p>
              <p className="mt-2 text-[11px] text-text-3">
                {new Date(review.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}

      {MOCK_REVIEWS.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <MessageSquare
            size={28}
            className="mx-auto text-text-3"
            strokeWidth={1.5}
          />
          <p className="mt-2 text-sm text-text-2">Belum ada review.</p>
        </div>
      )}
    </div>
  );
}
