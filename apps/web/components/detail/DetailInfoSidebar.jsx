"use client";

function formatListField(val) {
  if (Array.isArray(val)) {
    const clean = val.filter(Boolean);
    return clean.length > 0 ? clean.join(", ") : null;
  }
  return val || null;
}

export default function DetailInfoSidebar({ data, isAnime, totalCount }) {
  const synonyms = formatListField(data?.alternativeTitles?.synonyms);
  const producers = formatListField(data?.information?.producers);
  const studios = formatListField(data?.information?.studios);
  const authors = formatListField(data?.information?.authors);
  const serializations = formatListField(
    data?.information?.serializations || data?.information?.serialization
  );
  const licensors = formatListField(data?.information?.licensors);
  const genres = formatListField(data?.information?.genres);
  const themes = formatListField(data?.information?.themes);
  const demographics = formatListField(data?.information?.demographics);

  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5 space-y-6 shadow-sm">
        {/* Alternative Titles */}
        <div>
          <h3 className="font-black text-text text-base sm:text-lg tracking-tight font-['Bricolage_Grotesque'] border-b border-border pb-2.5 mb-3">
            Alternative Titles
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-text-2">
            {synonyms && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Synonyms:</span>{" "}
                <span className="text-text">{synonyms}</span>
              </p>
            )}
            {data?.alternativeTitles?.japanese && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Japanese:</span>{" "}
                <span className="text-text font-medium">
                  {data.alternativeTitles.japanese}
                </span>
              </p>
            )}
            {data?.alternativeTitles?.english && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">English:</span>{" "}
                <span className="text-text">{data.alternativeTitles.english}</span>
              </p>
            )}
            {!synonyms &&
              !data?.alternativeTitles?.japanese &&
              !data?.alternativeTitles?.english && (
                <p className="text-text-3">Judul alternatif belum tersedia.</p>
              )}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-black text-text text-base sm:text-lg tracking-tight font-['Bricolage_Grotesque'] border-b border-border pb-2.5 mb-3">
            Information
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-text-2">
            <p>
              <span className="font-semibold text-text-2">Type:</span>{" "}
              <span className="text-text font-semibold">
                {data?.information?.type || "-"}
              </span>
            </p>

            <p>
              <span className="font-semibold text-text-2">
                {isAnime ? "Episodes:" : "Chapters:"}
              </span>{" "}
              <span className="text-text font-semibold">
                {totalCount !== null ? totalCount : "-"}
              </span>
            </p>

            {!isAnime && data?.information?.volumes != null && (
              <p>
                <span className="font-semibold text-text-2">Volumes:</span>{" "}
                <span className="text-text">{data.information.volumes}</span>
              </p>
            )}

            <p>
              <span className="font-semibold text-text-2">Status:</span>{" "}
              <span className="text-text font-semibold">
                {data?.information?.status || data?.status || "-"}
              </span>
            </p>

            <p>
              <span className="font-semibold text-text-2">Ranked:</span>{" "}
              <span className="text-accent-text font-bold">
                {data?.statistics?.ranked || "-"}
              </span>
            </p>

            <p>
              <span className="font-semibold text-text-2">Popularity:</span>{" "}
              <span className="text-text font-bold">
                {data?.statistics?.popularity || "-"}
              </span>
            </p>

            <p>
              <span className="font-semibold text-text-2">Members:</span>{" "}
              <span className="text-text">{data?.statistics?.members || "-"}</span>
            </p>

            <p>
              <span className="font-semibold text-text-2">Favorites:</span>{" "}
              <span className="text-text">{data?.statistics?.favorites || "-"}</span>
            </p>

            {isAnime ? (
              <>
                <p>
                  <span className="font-semibold text-text-2">Aired:</span>{" "}
                  <span className="text-text">{data?.information?.aired || "-"}</span>
                </p>
                {data?.information?.premiered && (
                  <p>
                    <span className="font-semibold text-text-2">Premiered:</span>{" "}
                    <span className="text-accent-text font-bold">
                      {data.information.premiered}
                    </span>
                  </p>
                )}
                {data?.information?.broadcast && (
                  <p>
                    <span className="font-semibold text-text-2">Broadcast:</span>{" "}
                    <span className="text-text">{data.information.broadcast}</span>
                  </p>
                )}
                {producers && (
                  <p className="leading-relaxed">
                    <span className="font-semibold text-text-2">Producers:</span>{" "}
                    <span className="text-text">{producers}</span>
                  </p>
                )}
                {studios && (
                  <p>
                    <span className="font-semibold text-text-2">Studios:</span>{" "}
                    <span className="text-accent-text font-bold">{studios}</span>
                  </p>
                )}
                {data?.information?.duration && (
                  <p>
                    <span className="font-semibold text-text-2">Duration:</span>{" "}
                    <span className="text-text">{data.information.duration}</span>
                  </p>
                )}
                {data?.information?.rating && (
                  <p>
                    <span className="font-semibold text-text-2">Rating:</span>{" "}
                    <span className="text-text">{data.information.rating}</span>
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold text-text-2">Published:</span>{" "}
                  <span className="text-text">
                    {data?.information?.published || "-"}
                  </span>
                </p>
                {authors && (
                  <p>
                    <span className="font-semibold text-text-2">Authors:</span>{" "}
                    <span className="text-accent-text font-bold">{authors}</span>
                  </p>
                )}
                {serializations && (
                  <p>
                    <span className="font-semibold text-text-2">Serialization:</span>{" "}
                    <span className="text-text">{serializations}</span>
                  </p>
                )}
              </>
            )}

            {licensors && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Licensors:</span>{" "}
                <span className="text-text">{licensors}</span>
              </p>
            )}

            {(isAnime || Boolean(data?.information?.source)) && (
              <p>
                <span className="font-semibold text-text-2">Source:</span>{" "}
                <span className="text-text">{data?.information?.source || "-"}</span>
              </p>
            )}

            {genres && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Genres:</span>{" "}
                <span className="text-text">{genres}</span>
              </p>
            )}

            {themes && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Themes:</span>{" "}
                <span className="text-text">{themes}</span>
              </p>
            )}

            {demographics && (
              <p className="leading-relaxed">
                <span className="font-semibold text-text-2">Demographic:</span>{" "}
                <span className="text-text">{demographics}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

