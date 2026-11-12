/**
 * catalogEnricher.js
 *
 * Normalizer & helper untuk detail katalog anime/manga agar 100% menampilkan
 * data asli dari API (Backend Tenrai/Jikan & AniList) tanpa data statistik,
 * karakter, staf, atau judul palsu.
 */

const TENRAI_DETAIL_BASE_URL = (
  process.env.NEXT_PUBLIC_TENRAI_BASE_URL || "https://api.tenrai.org/v1"
).replace(/\/$/, "");
const JIKAN_DETAIL_BASE_URL = "https://api.jikan.moe/v4";

// ID YouTube Trailer resmi terverifikasi (selaras dengan Hero Beranda & official PV)
const POPULAR_ANIME_TRAILERS = {
  16498: "LHtdKWJdif4", // Shingeki no Kyojin
  1535: "Vt_3c8BgxV4",  // Death Note
  5114: "1ac3_YdSSy0",  // Fullmetal Alchemist: Brotherhood
  30276: "ExUMiF1L0HA", // One Punch Man
  38000: "6vMuWuWlW4I", // Kimetsu no Yaiba
  31964: "D5fYOnwYkj4", // Boku no Hero Academia
  40748: "pkKu9hLT-t8", // Jujutsu Kaisen
};

// Backdrop FHD 16:9 resmi yang identik dengan Hero Banner utama Beranda
export const HERO_TRAILER_BANNERS = {
  16498: "https://img.youtube.com/vi/LHtdKWJdif4/maxresdefault.jpg",
  1535: "https://img.youtube.com/vi/Vt_3c8BgxV4/maxresdefault.jpg",
  5114: "https://img.youtube.com/vi/1ac3_YdSSy0/maxresdefault.jpg",
  30276: "https://img.youtube.com/vi/ExUMiF1L0HA/maxresdefault.jpg",
  38000: "https://img.youtube.com/vi/6vMuWuWlW4I/maxresdefault.jpg",
  31964: "https://img.youtube.com/vi/D5fYOnwYkj4/maxresdefault.jpg",
};

/**
 * Membangun URL embed YouTube dengan kontrol pemutaran mandiri (autoplay=0)
 */
export function buildTrailerEmbedUrl(youtubeId) {
  if (!youtubeId) return null;
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&controls=1&rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Mengekstrak 11 karakter YouTube Video ID dari URL atau objek trailer API
 */
export function extractYoutubeId(trailerObj) {
  if (!trailerObj) return null;
  if (typeof trailerObj === "string") {
    const match = trailerObj.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|i\.ytimg\.com\/vi\/|img\.youtube\.com\/vi\/)([\w-]{11})/
    );
    return match ? match[1] : trailerObj.length === 11 ? trailerObj : null;
  }
  if (trailerObj.youtubeId) return trailerObj.youtubeId;
  if (trailerObj.youtube_id) return trailerObj.youtube_id;
  if (trailerObj.embedUrl || trailerObj.embed_url) {
    const rawEmbed = trailerObj.embedUrl || trailerObj.embed_url;
    const match = rawEmbed.match(/(?:embed\/)([\w-]{11})/);
    if (match) return match[1];
  }
  if (trailerObj.url) {
    const match = trailerObj.url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
    if (match) return match[1];
  }
  const imgUrl =
    trailerObj.images?.maximum_image_url ||
    trailerObj.images?.large_image_url ||
    null;
  if (imgUrl) {
    const match = imgUrl.match(/(?:\/vi\/)([\w-]{11})/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Mem-parse string theme lagu OP/ED format MAL/Jikan menjadi { title, artist }
 */
export function parseThemeEntry(item) {
  if (!item) return null;
  if (typeof item === "object" && item.title) {
    return {
      title: String(item.title).trim(),
      artist: item.artist ? String(item.artist).trim() : "-",
    };
  }
  if (typeof item !== "string" || !item.trim()) return null;

  const cleaned = item
    .replace(/^\d+:\s*/, "")
    .replace(/\s*\(eps?[^)]*\)\s*$/i, "")
    .trim();

  const quotedMatch = cleaned.match(/^"([^"]+)"\s+by\s+(.+)$/i);
  if (quotedMatch) {
    return { title: quotedMatch[1].trim(), artist: quotedMatch[2].trim() };
  }
  const simpleMatch = cleaned.match(/^(.+?)\s+by\s+(.+)$/i);
  if (simpleMatch) {
    return {
      title: simpleMatch[1].replace(/^["']|["']$/g, "").trim(),
      artist: simpleMatch[2].trim(),
    };
  }
  return { title: cleaned, artist: "-" };
}

function extractNames(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return arr
    .map((item) => (typeof item === "object" && item !== null ? item.name : item))
    .filter(Boolean);
}

function formatNumberLocale(val) {
  if (typeof val === "number" && !Number.isNaN(val)) {
    return val.toLocaleString("en-US");
  }
  if (typeof val === "string" && val.trim()) {
    const n = Number(val.replace(/,/g, ""));
    if (!Number.isNaN(n) && val.trim() !== "") return n.toLocaleString("en-US");
  }
  return null;
}

function formatRankTag(val) {
  if (val === null || val === undefined || val === "") return null;
  const str = String(val).trim();
  if (!str || str === "0" || str === "#0") return null;
  return str.startsWith("#") ? str : `#${str}`;
}

function extractTextField(val) {
  if (!val) return null;
  if (typeof val === "object") {
    return val.string ? String(val.string).trim() || null : null;
  }
  const str = String(val).trim();
  return str || null;
}

function capitalizeWord(word) {
  if (!word || typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Menormalisasi item detail katalog murni dari data yang disediakan API.
 * Field yang tidak disediakan API dikembalikan null / [] (tidak mengarang data).
 * @param {Object} rawData
 * @param {'anime' | 'manga'} type
 * @param {string|number} id
 */
export function enrichCatalogDetail(rawData, type = "anime", id = 1) {
  if (!rawData) return null;

  const isAnime = type === "anime";
  const numericId = Number(id || rawData.malId || rawData.mal_id || rawData.id || 0);

  const baseScore =
    typeof rawData.score === "number" && !Number.isNaN(rawData.score)
      ? rawData.score
      : null;

  const resolvedYoutubeId = isAnime
    ? extractYoutubeId(rawData.trailer) ||
      rawData.youtube_id ||
      POPULAR_ANIME_TRAILERS[numericId] ||
      null
    : null;

  const trailerEmbedUrl = buildTrailerEmbedUrl(resolvedYoutubeId);
  const heroMatchedBanner = isAnime ? HERO_TRAILER_BANNERS[numericId] || null : null;
  const maxTrailerImage =
    heroMatchedBanner ||
    rawData.trailer?.images?.maximum_image_url ||
    (resolvedYoutubeId
      ? `https://img.youtube.com/vi/${resolvedYoutubeId}/maxresdefault.jpg`
      : null);

  const rawTypeValue =
    rawData.format ||
    (rawData.type &&
    rawData.type !== "anime" &&
    rawData.type !== "manga"
      ? rawData.type
      : null);

  const rawSynonyms = rawData.titleSynonyms || rawData.title_synonyms;
  const cleanSynonyms = Array.isArray(rawSynonyms)
    ? rawSynonyms.map((s) => String(s || "").trim()).filter(Boolean)
    : [];

  const rawSeason = rawData.season ? capitalizeWord(rawData.season) : null;
  const rawYear = rawData.year || null;
  const premieredStr =
    rawSeason && rawYear
      ? `${rawSeason} ${rawYear}`
      : rawData.premiered || null;

  const rawOpenings =
    rawData.openings || rawData.theme?.openings || [];
  const rawEndings =
    rawData.endings || rawData.theme?.endings || [];

  const openings = Array.isArray(rawOpenings)
    ? rawOpenings.map(parseThemeEntry).filter(Boolean)
    : [];
  const endings = Array.isArray(rawEndings)
    ? rawEndings.map(parseThemeEntry).filter(Boolean)
    : [];

  const characters = Array.isArray(rawData.characters)
    ? rawData.characters
        .filter((ch) => ch && ch.name)
        .map((ch) => ({
          name: ch.name,
          role: ch.role || "Supporting",
          image: ch.image || "",
          voiceActor:
            isAnime && ch.voiceActor && ch.voiceActor.name
              ? {
                  name: ch.voiceActor.name,
                  language: ch.voiceActor.language || "Japanese",
                  image: ch.voiceActor.image || "",
                }
              : null,
        }))
    : [];

  const staff = Array.isArray(rawData.staff)
    ? rawData.staff
        .filter((st) => st && st.name)
        .map((st) => ({
          name: st.name,
          role: st.role || "-",
          image: st.image || "",
        }))
    : [];

  return {
    ...rawData,
    bannerImage:
      heroMatchedBanner ||
      rawData.bannerImage ||
      maxTrailerImage ||
      rawData.trailer?.images?.large_image_url ||
      null,
    score: baseScore,
    alternativeTitles: {
      synonyms: cleanSynonyms,
      japanese: rawData.titleJapanese || rawData.title_japanese || null,
      english: rawData.titleEnglish || rawData.title_english || null,
    },
    information: {
      type: rawTypeValue,
      episodes: isAnime
        ? (rawData.episodes ?? rawData.totalEpisodes ?? null)
        : null,
      chapters: !isAnime
        ? (rawData.chapters ?? rawData.totalChapters ?? null)
        : null,
      volumes: !isAnime ? (rawData.volumes ?? null) : null,
      status: rawData.status || null,
      aired: isAnime ? extractTextField(rawData.aired) : null,
      published: !isAnime ? extractTextField(rawData.published) : null,
      premiered: isAnime ? premieredStr : null,
      broadcast: isAnime ? extractTextField(rawData.broadcast) : null,
      producers: isAnime ? extractNames(rawData.producers) : [],
      licensors: isAnime ? extractNames(rawData.licensors) : [],
      studios: isAnime ? extractNames(rawData.studios) : [],
      authors: !isAnime ? extractNames(rawData.authors) : [],
      serializations: !isAnime ? extractNames(rawData.serializations) : [],
      source: rawData.source || null,
      genres: extractNames(rawData.genres),
      themes: extractNames(rawData.themes),
      demographics: extractNames(rawData.demographics),
      duration: isAnime ? rawData.duration || null : null,
      rating: isAnime ? rawData.rating || null : null,
    },
    statistics: {
      score: baseScore !== null ? baseScore.toFixed(2) : null,
      scoredBy: formatNumberLocale(rawData.scoredBy ?? rawData.scored_by),
      ranked: formatRankTag(rawData.rank),
      popularity: formatRankTag(rawData.popularity),
      members: formatNumberLocale(rawData.members),
      favorites: formatNumberLocale(rawData.favorites),
    },
    trailer:
      isAnime && resolvedYoutubeId
        ? {
            title: rawData.trailer?.title || "Official Trailer",
            youtubeId: resolvedYoutubeId,
            embedUrl: trailerEmbedUrl,
            images: rawData.trailer?.images || null,
            image:
              maxTrailerImage ||
              rawData.trailer?.images?.large_image_url ||
              null,
          }
        : null,
    characters,
    staff,
    openings: isAnime ? openings : [],
    endings: isAnime ? endings : [],
  };
}

const ANILIST_FORMAT_LABELS = {
  TV: "TV",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  MANGA: "Manga",
  NOVEL: "Light Novel",
  ONE_SHOT: "One-shot",
};

function formatEnumLabel(val) {
  if (!val || typeof val !== "string") return null;
  if (ANILIST_FORMAT_LABELS[val]) return ANILIST_FORMAT_LABELS[val];
  return val
    .split("_")
    .filter(Boolean)
    .map((part) => capitalizeWord(part))
    .join(" ");
}

function extractImageFromJikan(images) {
  return images?.webp?.image_url || images?.jpg?.image_url || "";
}

function mapJikanCharacters(list) {
  if (!Array.isArray(list)) return [];
  const sorted = [...list].sort((a, b) => {
    const aMain = a?.role === "Main" ? 0 : 1;
    const bMain = b?.role === "Main" ? 0 : 1;
    if (aMain !== bMain) return aMain - bMain;
    return (b?.favorites || 0) - (a?.favorites || 0);
  });

  return sorted.slice(0, 24).reduce((acc, item) => {
    if (item?.character?.name) {
      const vas = Array.isArray(item.voice_actors) ? item.voice_actors : [];
      const va = vas.find((v) => v.language === "Japanese") || vas[0] || null;
      acc.push({
        name: item.character.name,
        role: item.role || "Supporting",
        image: extractImageFromJikan(item.character.images),
        voiceActor: va?.person?.name
          ? {
              name: va.person.name,
              language: va.language || "Japanese",
              image: extractImageFromJikan(va.person.images),
            }
          : null,
      });
    } else if (item?.name) {
      acc.push(item);
    }
    return acc;
  }, []);
}

function mapJikanStaff(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 20).reduce((acc, item) => {
    if (item?.person?.name) {
      const positions = Array.isArray(item.positions) ? item.positions.filter(Boolean) : [];
      acc.push({
        name: item.person.name,
        role: positions.length > 0 ? positions.join(", ") : "-",
        image: extractImageFromJikan(item.person.images),
      });
    } else if (item?.name) {
      acc.push(item);
    }
    return acc;
  }, []);
}

function createDetailRequestSignal(externalSignal, timeoutMs = 8000) {
  const controller = new AbortController();
  let didTimeout = false;

  const onExternalAbort = () => {
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    didTimeout = true;
    controller.abort(new DOMException("Detail request timeout", "TimeoutError"));
  }, timeoutMs);

  return {
    signal: controller.signal,
    didTimeout: () => didTimeout,
    cleanup: () => {
      clearTimeout(timer);
      if (externalSignal) {
        externalSignal.removeEventListener("abort", onExternalAbort);
      }
    },
  };
}

function sleepAbortable(ms, signal) {
  if (!signal) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (signal.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function getDetailBaseUrls() {
  return Array.from(new Set([TENRAI_DETAIL_BASE_URL, JIKAN_DETAIL_BASE_URL]));
}

async function fetchCatalogResource(url, { signal = null, timeoutMs = 8000 } = {}) {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const attempt = async () => {
    const reqControl = createDetailRequestSignal(signal, timeoutMs);
    try {
      const res = await fetch(url, {
        signal: reqControl.signal,
        headers: { Accept: "application/json" },
      });
      if (res.status === 429) {
        const retrySec = Number(res.headers.get("retry-after"));
        const retryMs =
          !Number.isNaN(retrySec) && retrySec > 0
            ? Math.min(Math.max(retrySec * 1000, 400), 1500)
            : 1050;
        return { rateLimited: true, retryMs, data: null };
      }
      if (!res.ok) return { rateLimited: false, retryMs: 0, data: null };
      const json = await res.json();
      return { rateLimited: false, retryMs: 0, data: json?.data ?? null };
    } catch (err) {
      if (signal?.aborted) {
        throw err;
      }
      return { rateLimited: false, retryMs: 0, data: null };
    } finally {
      reqControl.cleanup();
    }
  };

  try {
    const first = await attempt();
    if (first.rateLimited) {
      await sleepAbortable(first.retryMs, signal);
      const retry = await attempt();
      return retry.data;
    }
    return first.data;
  } catch (err) {
    if (signal?.aborted) {
      throw err;
    }
    return null;
  }
}

async function fetchFirstAvailableResource(urls, options = {}) {
  const uniqueUrls = Array.from(new Set((urls || []).filter(Boolean)));
  for (const url of uniqueUrls) {
    const data = await fetchCatalogResource(url, options);
    if (data) return data;
  }
  return null;
}

/**
 * Mengambil suplemen karakter & staf langsung dari Tenrai API (dengan fallback Jikan v4).
 */
export async function fetchTenraiCreditsSupplement(mediaType, malId, options = {}) {
  const numericId = Number(malId);
  if (!numericId || Number.isNaN(numericId)) {
    return { characters: [], staff: [] };
  }

  const normalizedType = mediaType === "manga" ? "manga" : "anime";
  const {
    signal = null,
    includeCharacters = true,
    includeStaff = normalizedType === "anime",
  } = options;

  const baseUrls = getDetailBaseUrls();
  let rawCharacters = null;
  let rawStaff = null;

  if (includeCharacters) {
    rawCharacters = await fetchFirstAvailableResource(
      baseUrls.map((base) => `${base}/${normalizedType}/${numericId}/characters`),
      { signal, timeoutMs: 8000 }
    );
  }

  if (normalizedType === "anime" && includeStaff) {
    if (includeCharacters) {
      await sleepAbortable(260, signal);
    }
    rawStaff = await fetchFirstAvailableResource(
      baseUrls.map((base) => `${base}/anime/${numericId}/staff`),
      { signal, timeoutMs: 8000 }
    );
  }

  return {
    characters: mapJikanCharacters(rawCharacters),
    staff: mapJikanStaff(rawStaff),
  };
}

/**
 * Mengambil detail lengkap (statistik, tanggal tayang/terbit, produser, rating, tema, karakter, staf)
 * langsung dari Tenrai API v1 sebagai sumber utama, dengan fallback otomatis ke Jikan v4.
 */
export async function fetchTenraiDetailSupplement(mediaType, malId, options = {}) {
  const numericId = Number(malId);
  if (!numericId || Number.isNaN(numericId)) return null;

  const normalizedType = mediaType === "manga" ? "manga" : "anime";
  const {
    signal = null,
    includeCharacters = true,
    includeStaff = normalizedType === "anime",
  } = options;

  const baseUrls = getDetailBaseUrls();
  const detailUrls = baseUrls.flatMap((base) => [
    `${base}/${normalizedType}/${numericId}/full`,
    `${base}/${normalizedType}/${numericId}`,
  ]);

  const fullData = await fetchFirstAvailableResource(detailUrls, {
    signal,
    timeoutMs: 8000,
  });

  const credits =
    includeCharacters || (normalizedType === "anime" && includeStaff)
      ? await fetchTenraiCreditsSupplement(normalizedType, numericId, {
          signal,
          includeCharacters,
          includeStaff,
        })
      : { characters: [], staff: [] };

  if (!fullData && credits.characters.length === 0 && credits.staff.length === 0) {
    return null;
  }

  return {
    title: fullData?.title || null,
    titleEnglish: fullData?.title_english || null,
    titleJapanese: fullData?.title_japanese || null,
    titleSynonyms: Array.isArray(fullData?.title_synonyms) ? fullData.title_synonyms : [],
    format: fullData?.type || null,
    episodes: fullData?.episodes ?? null,
    chapters: fullData?.chapters ?? null,
    volumes: fullData?.volumes ?? null,
    status: fullData?.status || null,
    synopsis: fullData?.synopsis || null,
    score: fullData?.score ?? null,
    scoredBy: fullData?.scored_by ?? null,
    rank: fullData?.rank ?? null,
    popularity: fullData?.popularity ?? null,
    members: fullData?.members ?? null,
    favorites: fullData?.favorites ?? null,
    aired: extractTextField(fullData?.aired),
    published: extractTextField(fullData?.published),
    season: fullData?.season || null,
    year: fullData?.year ?? null,
    broadcast: extractTextField(fullData?.broadcast),
    producers: extractNames(fullData?.producers),
    licensors: extractNames(fullData?.licensors),
    studios: extractNames(fullData?.studios),
    authors: extractNames(fullData?.authors),
    serializations: extractNames(fullData?.serializations),
    source: fullData?.source || null,
    genres: extractNames(fullData?.genres),
    themes: extractNames(fullData?.themes),
    demographics: extractNames(fullData?.demographics),
    duration: fullData?.duration || null,
    rating: fullData?.rating || null,
    openings: Array.isArray(fullData?.theme?.openings) ? fullData.theme.openings : [],
    endings: Array.isArray(fullData?.theme?.endings) ? fullData.theme.endings : [],
    trailer: fullData?.trailer || null,
    characters: credits.characters,
    staff: credits.staff,
  };
}

export const fetchJikanDetailSupplement = fetchTenraiDetailSupplement;

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatFuzzyDate(dateObj) {
  if (!dateObj?.year) return null;
  const monthName =
    dateObj.month >= 1 && dateObj.month <= 12
      ? MONTH_SHORT_NAMES[dateObj.month - 1]
      : null;
  if (monthName && dateObj.day) {
    return `${monthName} ${dateObj.day}, ${dateObj.year}`;
  }
  if (monthName) {
    return `${monthName} ${dateObj.year}`;
  }
  return String(dateObj.year);
}

function formatAniListDateRange(startDate, endDate) {
  const startStr = formatFuzzyDate(startDate);
  const endStr = formatFuzzyDate(endDate);
  if (!startStr) return null;
  if (!endStr) return `${startStr} to ?`;
  if (startStr === endStr) return startStr;
  return `${startStr} to ${endStr}`;
}

/**
 * Mengambil banner horizontal resmi, trailer YouTube, serta metadata/karakter/staf
 * dari AniList GraphQL berdasarkan MAL ID.
 */
export async function fetchAniListMediaDetails(malId, mediaType, options = {}) {
  const numericId = Number(malId);
  if (!numericId || Number.isNaN(numericId)) return null;

  const query = `
    query ($idMal: Int, $type: MediaType) {
      Media(idMal: $idMal, type: $type) {
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        title {
          romaji
          english
          native
        }
        synonyms
        format
        episodes
        chapters
        volumes
        season
        seasonYear
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        genres
        source
        duration
        studios {
          edges {
            isMain
            node {
              name
            }
          }
        }
        characters(page: 1, perPage: 24, sort: [ROLE, FAVOURITES]) {
          edges {
            role
            node {
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        staff(page: 1, perPage: 20, sort: [RELEVANCE, ID]) {
          edges {
            role
            node {
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `;

  const reqControl = createDetailRequestSignal(options.signal, 5000);
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          idMal: numericId,
          type: mediaType === "manga" ? "MANGA" : "ANIME",
        },
      }),
      signal: reqControl.signal,
    });

    if (!res.ok) return null;
    const json = await res.json();
    const media = json?.data?.Media;
    if (!media) return null;

    const ytId =
      media.trailer?.site === "youtube" && media.trailer?.id
        ? media.trailer.id
        : null;

    const studioEdges = Array.isArray(media.studios?.edges) ? media.studios.edges : [];
    const mainStudios = studioEdges.filter((e) => e?.isMain && e?.node?.name).map((e) => e.node.name);
    const allStudios = studioEdges.filter((e) => e?.node?.name).map((e) => e.node.name);
    const dateRange = formatAniListDateRange(media.startDate, media.endDate);

    const characters = Array.isArray(media.characters?.edges)
      ? media.characters.edges
          .filter((edge) => edge?.node?.name?.full)
          .map((edge) => {
            const va = Array.isArray(edge.voiceActors) ? edge.voiceActors[0] : null;
            return {
              name: edge.node.name.full,
              role: edge.role ? capitalizeWord(edge.role) : "Supporting",
              image: edge.node.image?.large || "",
              voiceActor: va?.name?.full
                ? {
                    name: va.name.full,
                    language: "Japanese",
                    image: va.image?.large || "",
                  }
                : null,
            };
          })
      : [];

    const staff = Array.isArray(media.staff?.edges)
      ? media.staff.edges
          .filter((edge) => edge?.node?.name?.full)
          .map((edge) => ({
            name: edge.node.name.full,
            role: edge.role || "-",
            image: edge.node.image?.large || "",
          }))
      : [];

    return {
      bannerImage: media.bannerImage || null,
      trailerYoutubeId: ytId,
      trailerThumbnail:
        media.trailer?.thumbnail ||
        (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null),
      titleEnglish: media.title?.english || null,
      titleJapanese: media.title?.native || null,
      titleSynonyms: Array.isArray(media.synonyms) ? media.synonyms.filter(Boolean) : [],
      format: formatEnumLabel(media.format),
      episodes: media.episodes ?? null,
      chapters: media.chapters ?? null,
      volumes: media.volumes ?? null,
      season: media.season ? capitalizeWord(media.season) : null,
      year: media.seasonYear ?? null,
      aired: mediaType !== "manga" ? dateRange : null,
      published: mediaType === "manga" ? dateRange : null,
      genres: Array.isArray(media.genres) ? media.genres.filter(Boolean) : [],
      source: formatEnumLabel(media.source),
      duration: media.duration ? `${media.duration} min` : null,
      studios: mainStudios.length > 0 ? mainStudios : allStudios,
      characters,
      staff,
    };
  } catch (err) {
    if (options.signal?.aborted) {
      throw err;
    }
    return null;
  } finally {
    reqControl.cleanup();
  }
}

function pickFirstValue(...values) {
  for (const val of values) {
    if (val !== undefined && val !== null && val !== "") return val;
  }
  return null;
}

function pickFirstArray(...arrays) {
  for (const arr of arrays) {
    if (Array.isArray(arr) && arr.length > 0) return arr;
  }
  return [];
}

/**
 * Menggabungkan data mentah backend dengan suplemen Tenrai/Jikan & AniList secara berurutan prioritas.
 */
export function mergeCatalogDetailSources(backendRaw, jikanSup, anilistSup) {
  if (!backendRaw) return null;

  const backendTrailerId = extractYoutubeId(backendRaw.trailer);
  const jikanTrailerId = extractYoutubeId(jikanSup?.trailer);
  const resolvedTrailer = backendTrailerId
    ? backendRaw.trailer
    : jikanTrailerId
    ? jikanSup.trailer
    : anilistSup?.trailerYoutubeId
    ? {
        title: "Official PV Trailer",
        youtubeId: anilistSup.trailerYoutubeId,
        embedUrl: buildTrailerEmbedUrl(anilistSup.trailerYoutubeId),
        images: anilistSup.trailerThumbnail
          ? { maximum_image_url: anilistSup.trailerThumbnail }
          : null,
        image: anilistSup.trailerThumbnail || null,
      }
    : backendRaw.trailer || jikanSup?.trailer || null;

  return {
    ...backendRaw,
    synopsis: pickFirstValue(backendRaw.synopsis, jikanSup?.synopsis),
    status: pickFirstValue(backendRaw.status, jikanSup?.status),
    score: backendRaw.score ?? jikanSup?.score ?? null,
    scoredBy: backendRaw.scoredBy ?? backendRaw.scored_by ?? jikanSup?.scoredBy ?? null,
    rank: backendRaw.rank ?? jikanSup?.rank ?? null,
    popularity: backendRaw.popularity ?? jikanSup?.popularity ?? null,
    members: backendRaw.members ?? jikanSup?.members ?? null,
    favorites: backendRaw.favorites ?? jikanSup?.favorites ?? null,
    format: pickFirstValue(
      backendRaw.format,
      backendRaw.type !== "anime" && backendRaw.type !== "manga" ? backendRaw.type : null,
      jikanSup?.format,
      anilistSup?.format
    ),
    titleEnglish: pickFirstValue(
      backendRaw.titleEnglish,
      backendRaw.title_english,
      jikanSup?.titleEnglish,
      anilistSup?.titleEnglish
    ),
    titleJapanese: pickFirstValue(
      backendRaw.titleJapanese,
      backendRaw.title_japanese,
      jikanSup?.titleJapanese,
      anilistSup?.titleJapanese
    ),
    titleSynonyms: pickFirstArray(
      backendRaw.titleSynonyms,
      backendRaw.title_synonyms,
      jikanSup?.titleSynonyms,
      anilistSup?.titleSynonyms
    ),
    episodes:
      backendRaw.episodes ??
      backendRaw.totalEpisodes ??
      jikanSup?.episodes ??
      anilistSup?.episodes ??
      null,
    chapters:
      backendRaw.chapters ??
      backendRaw.totalChapters ??
      jikanSup?.chapters ??
      anilistSup?.chapters ??
      null,
    volumes: backendRaw.volumes ?? jikanSup?.volumes ?? anilistSup?.volumes ?? null,
    aired: pickFirstValue(
      extractTextField(backendRaw.aired),
      extractTextField(jikanSup?.aired),
      anilistSup?.aired
    ),
    published: pickFirstValue(
      extractTextField(backendRaw.published),
      extractTextField(jikanSup?.published),
      anilistSup?.published
    ),
    season: pickFirstValue(backendRaw.season, jikanSup?.season, anilistSup?.season),
    year: backendRaw.year ?? jikanSup?.year ?? anilistSup?.year ?? null,
    broadcast: pickFirstValue(
      extractTextField(backendRaw.broadcast),
      extractTextField(jikanSup?.broadcast)
    ),
    producers: pickFirstArray(backendRaw.producers, jikanSup?.producers),
    licensors: pickFirstArray(backendRaw.licensors, jikanSup?.licensors),
    studios: pickFirstArray(backendRaw.studios, jikanSup?.studios, anilistSup?.studios),
    authors: pickFirstArray(backendRaw.authors, jikanSup?.authors),
    serializations: pickFirstArray(backendRaw.serializations, jikanSup?.serializations),
    source: pickFirstValue(backendRaw.source, jikanSup?.source, anilistSup?.source),
    genres: pickFirstArray(backendRaw.genres, jikanSup?.genres, anilistSup?.genres),
    themes: pickFirstArray(backendRaw.themes, jikanSup?.themes),
    demographics: pickFirstArray(backendRaw.demographics, jikanSup?.demographics),
    duration: pickFirstValue(backendRaw.duration, jikanSup?.duration, anilistSup?.duration),
    rating: pickFirstValue(backendRaw.rating, jikanSup?.rating),
    openings: pickFirstArray(backendRaw.openings, backendRaw.theme?.openings, jikanSup?.openings),
    endings: pickFirstArray(backendRaw.endings, backendRaw.theme?.endings, jikanSup?.endings),
    characters: pickFirstArray(backendRaw.characters, anilistSup?.characters, jikanSup?.characters),
    staff: pickFirstArray(backendRaw.staff, anilistSup?.staff, jikanSup?.staff),
    trailer: resolvedTrailer,
  };
}
