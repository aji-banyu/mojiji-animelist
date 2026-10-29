/**
 * trackerMock.js — Data tiruan untuk endpoint tracker (daftar tontonan/bacaan).
 *
 * Format respons mengikuti kontrak resmi di docs/api/api-contract-mvp.md:
 * - Sukses : { success: true, data: [...] } atau { success: true, data: {...} }
 * - Error  : { success: false, error: { code, message } }
 *
 * Endpoint yang dicakup:
 * - GET    /api/tracker
 * - POST   /api/tracker
 * - PATCH  /api/tracker/:id/status
 * - POST   /api/tracker/:id/increment
 * - DELETE /api/tracker/:id
 *
 * Status yang valid (sesuai PRD & docs/architecture/frontend-technical-notes.md):
 *   plan | watching | reading | completed | on_hold | dropped
 */

// ============================================================
// DAFTAR TRACKER (GET /api/tracker)
// ============================================================

export const mockTrackerList = {
  success: true,
  data: [
    {
      id: "trk_001",
      mal_id: 20,
      media_type: "anime",
      title: "Naruto",
      image_url: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      status: "watching",
      progress: 45,
      total: 220,
      updated_at: "2026-10-28T14:30:00Z",
    },
    {
      id: "trk_002",
      mal_id: 1,
      media_type: "manga",
      title: "Monster",
      image_url: "https://cdn.myanimelist.net/images/manga/3/258224.jpg",
      status: "reading",
      progress: 58,
      total: 162,
      updated_at: "2026-10-28T10:15:00Z",
    },
    {
      id: "trk_003",
      mal_id: 1735,
      media_type: "anime",
      title: "Naruto: Shippuuden",
      image_url: "https://cdn.myanimelist.net/images/anime/1565/111305.jpg",
      status: "plan",
      progress: 0,
      total: 500,
      updated_at: "2026-10-27T08:00:00Z",
    },
    {
      id: "trk_004",
      mal_id: 38000,
      media_type: "anime",
      title: "Kimetsu no Yaiba",
      image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      status: "completed",
      progress: 26,
      total: 26,
      updated_at: "2026-10-25T20:00:00Z",
    },
    {
      id: "trk_005",
      mal_id: 16498,
      media_type: "anime",
      title: "Shingeki no Kyojin",
      image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      status: "on_hold",
      progress: 12,
      total: 25,
      updated_at: "2026-10-20T15:45:00Z",
    },
    {
      id: "trk_006",
      mal_id: 2,
      media_type: "manga",
      title: "Berserk",
      image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
      status: "dropped",
      progress: 30,
      total: 380,
      updated_at: "2026-10-18T09:00:00Z",
    },
  ],
};

// ============================================================
// TAMBAH ITEM KE TRACKER (POST /api/tracker) — 201 Created
// ============================================================

export const mockTrackerAddSuccess = {
  success: true,
  data: {
    id: "trk_007",
    mal_id: 21,
    media_type: "anime",
    title: "One Piece",
    image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    status: "plan",
    progress: 0,
    total: 1122,
    updated_at: "2026-10-29T02:30:00Z",
  },
};

// ============================================================
// UBAH STATUS TRACKER (PATCH /api/tracker/:id/status) — 200 OK
// ============================================================

export const mockTrackerUpdateStatus = {
  success: true,
  data: {
    id: "trk_001",
    status: "completed",
    updated_at: "2026-10-29T02:31:00Z",
  },
};

// ============================================================
// INCREMENT PROGRES (POST /api/tracker/:id/increment) — 200 OK
// ============================================================

export const mockTrackerIncrement = {
  success: true,
  data: {
    id: "trk_001",
    progress: 46,
    updated_at: "2026-10-29T02:32:00Z",
  },
};

// ============================================================
// HAPUS TRACKER (DELETE /api/tracker/:id) — 204 No Content
// ============================================================

export const mockTrackerDeleteSuccess = {
  success: true,
  data: null,
};

// ============================================================
// ERROR: Judul sudah ada di tracker (409 Conflict)
// ============================================================

export const mockTrackerConflict = {
  success: false,
  error: {
    code: "CONFLICT",
    message: "Judul sudah ada di tracker",
    details: [],
  },
};

// ============================================================
// ERROR: Tracker tidak ditemukan (404 Not Found)
// ============================================================

export const mockTrackerNotFound = {
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Tracker tidak ditemukan",
    details: [],
  },
};

// ============================================================
// ERROR: Belum login (401 Unauthorized)
// ============================================================

export const mockTrackerUnauthorized = {
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Belum login atau sesi tidak valid",
    details: [],
  },
};

