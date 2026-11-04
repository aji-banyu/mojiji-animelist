/**
 * catalogMock.js — Data tiruan untuk endpoint pencarian & detail anime/manga.
 *
 * Format respons mengikuti kontrak resmi di docs/api/api-contract-mvp.md:
 * - Sukses : { success: true, data: [...] } atau { success: true, data: {...} }
 * - Error  : { success: false, error: { code, message } }
 *
 * Endpoint yang dicakup:
 * - GET /api/catalog/search?type=anime&q=...
 * - GET /api/catalog/search?type=manga&q=...
 * - GET /api/catalog/:type/:malId
 */

// ============================================================
// PENCARIAN ANIME (GET /api/catalog/search?type=anime&q=naruto)
// ============================================================

export const mockSearchAnime = {
  success: true,
  data: [
    {
      mal_id: 20,
      type: "anime",
      title: "Naruto",
      image_url: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      score: 7.99,
      totalEpisodes: 220,
    },
    {
      mal_id: 1735,
      type: "anime",
      title: "Naruto: Shippuuden",
      image_url: "https://cdn.myanimelist.net/images/anime/1565/111305.jpg",
      score: 8.27,
      totalEpisodes: 500,
    },
    {
      mal_id: 16498,
      type: "anime",
      title: "Shingeki no Kyojin",
      image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      score: 8.54,
      totalEpisodes: 25,
    },
    {
      mal_id: 21,
      type: "anime",
      title: "One Piece",
      image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      score: 8.72,
      totalEpisodes: 1122,
    },
    {
      mal_id: 38000,
      type: "anime",
      title: "Kimetsu no Yaiba",
      image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      score: 8.51,
      totalEpisodes: 26,
    },
  ],
  meta: {
    page: 1,
    limit: 10,
  },
};

// ============================================================
// PENCARIAN MANGA (GET /api/catalog/search?type=manga&q=monster)
// ============================================================

export const mockSearchManga = {
  success: true,
  data: [
    {
      mal_id: 1,
      type: "manga",
      title: "Monster",
      image_url: "https://cdn.myanimelist.net/images/manga/3/258224.jpg",
      score: 9.12,
      totalChapters: 162,
    },
    {
      mal_id: 2,
      type: "manga",
      title: "Berserk",
      image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
      score: 9.47,
      totalChapters: 380,
    },
    {
      mal_id: 13,
      type: "manga",
      title: "One Piece",
      image_url: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
      score: 9.22,
      totalChapters: null,
    },
  ],
  meta: {
    page: 1,
    limit: 10,
  },
};

// ============================================================
// DETAIL ANIME (GET /api/catalog/anime/20)
// ============================================================

export const mockAnimeDetail = {
  success: true,
  data: {
    mal_id: 20,
    type: "anime",
    title: "Naruto",
    image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    synopsis:
      "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the village, the Fourth Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto.",
    score: 7.99,
    totalEpisodes: 220,
    status: "Finished Airing",
  },
};

// ============================================================
// DETAIL MANGA (GET /api/catalog/manga/1)
// ============================================================

export const mockMangaDetail = {
  success: true,
  data: {
    mal_id: 1,
    type: "manga",
    title: "Monster",
    image: "https://cdn.myanimelist.net/images/manga/3/258224.jpg",
    synopsis:
      "Kenzou Tenma, a renowned Japanese neurosurgeon working in post-war Germany, faces a difficult choice: operate on Johan Liebert, an orphan boy on the verge of death, or on the town's mayor who requires immediate surgery.",
    score: 9.12,
    totalChapters: 162,
    status: "Finished",
  },
};

// ============================================================
// ERROR: Judul tidak ditemukan (404 Not Found)
// ============================================================

export const mockCatalogNotFound = {
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Judul tidak ditemukan",
    details: [],
  },
};

// ============================================================
// ERROR: Provider timeout (504 Gateway Timeout)
// ============================================================

export const mockCatalogTimeout = {
  success: false,
  error: {
    code: "GATEWAY_TIMEOUT",
    message: "Provider katalog mengalami timeout, coba lagi nanti",
    details: [],
  },
};

