"use client";

import { useState } from "react";
import { Play, VideoOff } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

const DETAIL_LIST_PAGE_SIZE = 4;

/**
 * Mengiris daftar karakter atau staf per halaman agar tinggi kartu tetap ringkas.
 */
function paginateDetailList(
  items = [],
  currentPage = 1,
  pageSize = DETAIL_LIST_PAGE_SIZE
) {
  const list = Array.isArray(items) ? items : [];
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  return {
    totalItems,
    totalPages,
    safePage,
    paginatedItems: list.slice(startIndex, startIndex + pageSize),
  };
}

export function DetailSynopsis({ synopsis }) {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  const synopsisText = (synopsis || "Sinopsis belum tersedia untuk judul ini.")
    .replace(/\[Written by MAL Rewrite\]/gi, "")
    .replace(/\(Source:[^)]+\)/gi, "")
    .trim();

  const isLongSynopsis = synopsisText.length > 200;

  return (
    <section aria-label="Sinopsis" className="w-full">
      {!isSynopsisExpanded ? (
        <div className="space-y-2.5">
          <p className="line-clamp-3 text-sm sm:text-base leading-relaxed text-text/90 font-normal text-justify select-text">
            {synopsisText}
          </p>
          {isLongSynopsis && (
            <button
              type="button"
              onClick={() => setIsSynopsisExpanded(true)}
              className="inline-flex items-center text-accent-text font-bold text-xs sm:text-sm hover:text-accent transition-colors cursor-pointer outline-none select-none"
            >
              Baca Selengkapnya
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          <p className="text-sm sm:text-base leading-relaxed text-text/90 font-normal text-justify select-text transition-all duration-300">
            {synopsisText}
          </p>
          <button
            type="button"
            onClick={() => setIsSynopsisExpanded(false)}
            className="inline-flex items-center text-accent-text font-bold text-xs sm:text-sm hover:text-accent transition-colors cursor-pointer outline-none select-none"
          >
            Tampilkan Lebih Sedikit
          </button>
        </div>
      )}
    </section>
  );
}

export default function DetailMediaSections({ data, isAnime, trailerHasError }) {
  const [characterPage, setCharacterPage] = useState(1);
  const [staffPage, setStaffPage] = useState(1);

  const characterPagination = paginateDetailList(data?.characters, characterPage);
  const staffPagination = paginateDetailList(data?.staff, staffPage);

  return (
    <div className="lg:col-span-8 space-y-6">
      {/* Trailer (Sejajar Alternative Titles, tepat di atas Characters & Voice Actors, tanpa padding & siku tajam) */}
      {isAnime && (
        <section
          aria-label="Trailer"
          className="w-full overflow-hidden rounded-none border border-border bg-surface shadow-sm"
        >
          {data?.trailer?.embedUrl && !trailerHasError ? (
            <div className="relative aspect-video w-full bg-bg rounded-none">
              <iframe
                src={data.trailer.embedUrl}
                title={`${data.title || "Anime"} - Trailer`}
                className="h-full w-full border-0 rounded-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex aspect-video min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-none bg-surface-2/60 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-none border border-border bg-surface text-text-3 shadow-sm">
                <VideoOff size={22} />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-sm sm:text-base font-bold text-text font-['Bricolage_Grotesque']">
                  Trailer Tidak Tersedia
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-text-2">
                  {trailerHasError
                    ? "Video trailer tidak dapat dimuat atau dibatasi untuk pemutaran sematan."
                    : "Video trailer resmi untuk judul ini belum tersedia saat ini."}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Characters */}
      <div className="space-y-4 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-text font-['Bricolage_Grotesque']">
            {isAnime ? "Characters & Voice Actors" : "Characters"}
          </h3>
          {characterPagination.totalPages > 1 && (
            <span className="text-xs font-medium text-text-3 tabular-nums">
              Halaman {characterPagination.safePage} dari {characterPagination.totalPages}
            </span>
          )}
        </div>
        {characterPagination.totalItems > 0 ? (
          <>
            <div className="flex flex-col gap-3 pt-1">
              {characterPagination.paginatedItems.map((char, idx) => (
                <div
                  key={`${characterPagination.safePage}-${idx}-${char.name}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3 sm:p-3.5 transition-colors hover:border-border-hover overflow-hidden min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-14 w-11 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                      {char.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={char.image}
                          alt={char.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface text-text-2 text-sm font-bold">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold text-text truncate">
                        {char.name}
                      </p>
                      <p className="text-xs sm:text-sm text-text-2 truncate mt-0.5">
                        {char.role}
                      </p>
                    </div>
                  </div>

                  {isAnime && char.voiceActor && (
                    <div className="flex items-center justify-end gap-3 text-right pl-3 shrink-0 max-w-[50%] overflow-hidden min-w-0">
                      <div className="overflow-hidden min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-accent-text truncate">
                          {char.voiceActor.name}
                        </p>
                        <p className="text-xs text-text-2 truncate mt-0.5">
                          {char.voiceActor.language}
                        </p>
                      </div>
                      <div className="h-14 w-11 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                        {char.voiceActor.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={char.voiceActor.image}
                            alt={char.voiceActor.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-surface text-text-2 text-sm font-bold">
                            ?
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Pagination
              size="sm"
              currentPage={characterPagination.safePage}
              totalPages={characterPagination.totalPages}
              totalItems={characterPagination.totalItems}
              itemsPerPage={DETAIL_LIST_PAGE_SIZE}
              itemLabel={isAnime ? "karakter & pengisi suara" : "karakter"}
              ariaLabel="Navigasi Halaman Karakter"
              onPageChange={setCharacterPage}
              className="border-t border-border/70 pt-3.5 pb-0.5"
            />
          </>
        ) : (
          <p className="py-2 text-xs sm:text-sm text-text-2">
            Data karakter belum tersedia dari API untuk judul ini.
          </p>
        )}
      </div>

      {/* Staff */}
      {(isAnime || staffPagination.totalItems > 0) && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-text font-['Bricolage_Grotesque']">
              Staff
            </h3>
            {staffPagination.totalPages > 1 && (
              <span className="text-xs font-medium text-text-3 tabular-nums">
                Halaman {staffPagination.safePage} dari {staffPagination.totalPages}
              </span>
            )}
          </div>
          {staffPagination.totalItems > 0 ? (
            <>
              <div className="flex flex-col gap-2.5 pt-1">
                {staffPagination.paginatedItems.map((st, idx) => (
                  <div
                    key={`${staffPagination.safePage}-${idx}-${st.name}`}
                    className="flex items-center gap-3.5 rounded-lg border border-border bg-surface-2 p-3 sm:p-3.5 transition-colors hover:border-border-hover overflow-hidden min-w-0"
                  >
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-surface border border-border">
                      {st.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={st.image}
                          alt={st.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface text-text-2 text-sm font-bold">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-bold text-text truncate">
                        {st.name}
                      </p>
                      <p className="text-xs sm:text-sm text-text-2 truncate mt-0.5">
                        {st.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                size="sm"
                currentPage={staffPagination.safePage}
                totalPages={staffPagination.totalPages}
                totalItems={staffPagination.totalItems}
                itemsPerPage={DETAIL_LIST_PAGE_SIZE}
                itemLabel="staf"
                ariaLabel="Navigasi Halaman Staff"
                onPageChange={setStaffPage}
                className="border-t border-border/70 pt-3.5 pb-0.5"
              />
            </>
          ) : (
            <p className="py-2 text-xs sm:text-sm text-text-2">
              Data staf produksi belum tersedia dari API untuk judul ini.
            </p>
          )}
        </div>
      )}

      {/* Theme Songs (Opening & Ending - Anime Only) */}
      {isAnime && (data?.openings?.length > 0 || data?.endings?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.openings?.length > 0 && (
            <div className="space-y-3 rounded-xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-text font-['Bricolage_Grotesque'] border-b border-border pb-3">
                Opening Theme
              </h3>
              <div className="space-y-2 pt-1">
                {data.openings.slice(0, 6).map((op, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 p-3 text-xs transition-colors hover:border-border-hover"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-text">
                        <Play size={12} className="fill-current ml-0.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-text truncate">&quot;{op.title}&quot;</p>
                        {op.artist && op.artist !== "-" && (
                          <p className="text-text-2 truncate mt-0.5">by {op.artist}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.endings?.length > 0 && (
            <div className="space-y-3 rounded-xl border border-border bg-surface p-5 shadow-sm">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-text font-['Bricolage_Grotesque'] border-b border-border pb-3">
                Ending Theme
              </h3>
              <div className="space-y-2 pt-1">
                {data.endings.slice(0, 6).map((ed, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 p-3 text-xs transition-colors hover:border-border-hover"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-success-soft text-success">
                        <Play size={12} className="fill-success ml-0.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-text truncate">&quot;{ed.title}&quot;</p>
                        {ed.artist && ed.artist !== "-" && (
                          <p className="text-text-2 truncate mt-0.5">by {ed.artist}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

