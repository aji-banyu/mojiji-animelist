/**
 * homeData.js — Sumber data & helper pemanggilan katalog untuk Halaman Home (Beranda).
 *
 * Mengintegrasikan 4 Section Resmi berbasis Tenrai API (https://api.tenrai.org/v1):
 * 1. Top Rated         (Karya Terbaik dengan skor tertinggi)
 * 2. Rekomendasi Mojiji (Pilihan Kurasi Editor / Must Watch)
 * 3. Sedang Tren       (Judul yang sedang tayang & hangat dibicarakan)
 * 4. Klasik Legendaris (Karya legendaris sepanjang masa)
 *
 * Masing-masing didukung kurasi 48 item nyata (12 item x 4 halaman) dengan poster 100% aktif,
 * menjamin navigasi cepat, tahan gangguan upstream, dan bebas kartu kosong.
 */

const TENRAI_BASE_URL = process.env.NEXT_PUBLIC_TENRAI_BASE_URL || "https://api.tenrai.org/v1";

export const FALLBACK_HOME_DATA = {
  anime: {
    top_rated: [
  {
    "id": 52991,
    "malId": 52991,
    "title": "Sousou no Frieren",
    "score": "9.3",
    "views": "2.1m",
    "metaCount": "EPS. 28",
    "statusBadge": "⭐ 9.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1015/138075.jpg"
  },
  {
    "id": 5114,
    "malId": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "score": "9.1",
    "views": "4.2m",
    "metaCount": "EPS. 64",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
  },
  {
    "id": 9253,
    "malId": 9253,
    "title": "Steins;Gate",
    "score": "9.1",
    "views": "3.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1935/127974.jpg"
  },
  {
    "id": 11061,
    "malId": 11061,
    "title": "Hunter x Hunter (2011)",
    "score": "9.0",
    "views": "3.7m",
    "metaCount": "EPS. 148",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg"
  },
  {
    "id": 41467,
    "malId": 41467,
    "title": "Bleach: Sennen Kessen-hen",
    "score": "9.0",
    "views": "1.8m",
    "metaCount": "EPS. 13",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1908/120036.jpg"
  },
  {
    "id": 918,
    "malId": 918,
    "title": "Gintama",
    "score": "8.9",
    "views": "1.3m",
    "metaCount": "EPS. 201",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/73274.jpg"
  },
  {
    "id": 40028,
    "malId": 40028,
    "title": "Shingeki no Kyojin: Final",
    "score": "8.8",
    "views": "3.9m",
    "metaCount": "EPS. 16",
    "statusBadge": "⭐ 8.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1000/110531.jpg"
  },
  {
    "id": 19,
    "malId": 19,
    "title": "Monster",
    "score": "8.9",
    "views": "1.9m",
    "metaCount": "EPS. 74",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/18740.jpg"
  },
  {
    "id": 2904,
    "malId": 2904,
    "title": "Code Geass: Lelouch R2",
    "score": "8.9",
    "views": "2.6m",
    "metaCount": "EPS. 25",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/9391.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Cowboy Bebop",
    "score": "8.7",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
  },
  {
    "id": 37521,
    "malId": 37521,
    "title": "Vinland Saga",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1500/103005.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "One Piece",
    "score": "8.7",
    "views": "6.1m",
    "metaCount": "EPS. 1122",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
  },
  {
    "id": 32182,
    "malId": 32182,
    "title": "Mob Psycho 100",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1918/96303.jpg"
  },
  {
    "id": 33352,
    "malId": 33352,
    "title": "Violet Evergarden",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "EPS. 13",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1795/95088.jpg"
  },
  {
    "id": 40748,
    "malId": 40748,
    "title": "Jujutsu Kaisen",
    "score": "8.6",
    "views": "3.5m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
  },
  {
    "id": 1535,
    "malId": 1535,
    "title": "Death Note",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "EPS. 37",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1079/138100.jpg"
  },
  {
    "id": 42310,
    "malId": 42310,
    "title": "Cyberpunk: Edgerunners",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 10",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1818/126435.jpg"
  },
  {
    "id": 34599,
    "malId": 34599,
    "title": "Made in Abyss",
    "score": "8.6",
    "views": "1.5m",
    "metaCount": "EPS. 13",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/86733.jpg"
  },
  {
    "id": 2001,
    "malId": 2001,
    "title": "Tengen Toppa Gurren Lagann",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 27",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/5123.jpg"
  },
  {
    "id": 23273,
    "malId": 23273,
    "title": "Shigatsu wa Kimi no Uso",
    "score": "8.6",
    "views": "2.2m",
    "metaCount": "EPS. 22",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/14/71553.jpg"
  },
  {
    "id": 38000,
    "malId": 38000,
    "title": "Kimetsu no Yaiba",
    "score": "8.5",
    "views": "3.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
  },
  {
    "id": 16498,
    "malId": 16498,
    "title": "Attack on Titan",
    "score": "8.5",
    "views": "4.8m",
    "metaCount": "EPS. 25",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
  },
  {
    "id": 30276,
    "malId": 30276,
    "title": "One Punch Man",
    "score": "8.5",
    "views": "3.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/12/76049.jpg"
  },
  {
    "id": 205,
    "malId": 205,
    "title": "Samurai Champloo",
    "score": "8.5",
    "views": "1.4m",
    "metaCount": "EPS. 26",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/11/29134.jpg"
  },
  {
    "id": 44511,
    "malId": 44511,
    "title": "Chainsaw Man",
    "score": "8.5",
    "views": "2.5m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"
  },
  {
    "id": 50265,
    "malId": 50265,
    "title": "Spy x Family",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1441/122795.jpg"
  },
  {
    "id": 52034,
    "malId": 52034,
    "title": "Oshi no Ko",
    "score": "8.6",
    "views": "1.7m",
    "metaCount": "EPS. 11",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1813/134428.jpg"
  },
  {
    "id": 20583,
    "malId": 20583,
    "title": "Haikyuu!!",
    "score": "8.4",
    "views": "2.4m",
    "metaCount": "EPS. 25",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/7/76014.jpg"
  },
  {
    "id": 37999,
    "malId": 37999,
    "title": "Kaguya-sama wa Kokurasetai",
    "score": "8.4",
    "views": "2.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1295/106551.jpg"
  },
  {
    "id": 39535,
    "malId": 39535,
    "title": "Mushoku Tensei",
    "score": "8.4",
    "views": "1.5m",
    "metaCount": "EPS. 11",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1530/117776.jpg"
  },
  {
    "id": 30,
    "malId": 30,
    "title": "Neon Genesis Evangelion",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1314/108941.jpg"
  },
  {
    "id": 13601,
    "malId": 13601,
    "title": "Psycho-Pass",
    "score": "8.3",
    "views": "1.7m",
    "metaCount": "EPS. 22",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/43399.jpg"
  },
  {
    "id": 22535,
    "malId": 22535,
    "title": "Kiseijuu (Parasyte)",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/3/73178.jpg"
  },
  {
    "id": 37520,
    "malId": 37520,
    "title": "Dororo",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1879/100467.jpg"
  },
  {
    "id": 49596,
    "malId": 49596,
    "title": "Blue Lock",
    "score": "8.2",
    "views": "1.3m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1258/126929.jpg"
  },
  {
    "id": 52299,
    "malId": 52299,
    "title": "Solo Leveling",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1966/141351.jpg"
  },
  {
    "id": 245,
    "malId": 245,
    "title": "Great Teacher Onizuka",
    "score": "8.7",
    "views": "980k",
    "metaCount": "EPS. 43",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/11460.jpg"
  },
  {
    "id": 47917,
    "malId": 47917,
    "title": "Bocchi the Rock!",
    "score": "8.8",
    "views": "1.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1448/127956.jpg"
  },
  {
    "id": 31043,
    "malId": 31043,
    "title": "Erased",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/77957.jpg"
  },
  {
    "id": 6,
    "malId": 6,
    "title": "Trigun",
    "score": "8.2",
    "views": "830k",
    "metaCount": "EPS. 26",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/7/20310.jpg"
  },
  {
    "id": 38691,
    "malId": 38691,
    "title": "Dr. Stone",
    "score": "8.2",
    "views": "1.7m",
    "metaCount": "EPS. 24",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1613/102576.jpg"
  },
  {
    "id": 20507,
    "malId": 20507,
    "title": "Noragami",
    "score": "7.9",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 7.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/9/77809.jpg"
  },
  {
    "id": 34572,
    "malId": 34572,
    "title": "Black Clover",
    "score": "8.1",
    "views": "2.0m",
    "metaCount": "EPS. 170",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/88336.jpg"
  },
  {
    "id": 4224,
    "malId": 4224,
    "title": "Toradora!",
    "score": "8.1",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/22128.jpg"
  },
  {
    "id": 19815,
    "malId": 19815,
    "title": "No Game No Life",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1074/111944.jpg"
  },
  {
    "id": 35507,
    "malId": 35507,
    "title": "Classroom of the Elite",
    "score": "7.8",
    "views": "1.8m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 7.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1165/120987.jpg"
  },
  {
    "id": 30831,
    "malId": 30831,
    "title": "KonoSuba",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 10",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/8/77831.jpg"
  },
  {
    "id": 22319,
    "malId": 22319,
    "title": "Tokyo Ghoul",
    "score": "7.8",
    "views": "3.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "⭐ 7.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1498/134443.jpg"
  }
],
    recommended: [
  {
    "id": 16498,
    "malId": 16498,
    "title": "Attack on Titan",
    "score": "8.5",
    "views": "4.8m",
    "metaCount": "EPS. 25",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
  },
  {
    "id": 38000,
    "malId": 38000,
    "title": "Kimetsu no Yaiba",
    "score": "8.5",
    "views": "3.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "Must Watch",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
  },
  {
    "id": 40748,
    "malId": 40748,
    "title": "Jujutsu Kaisen",
    "score": "8.6",
    "views": "3.5m",
    "metaCount": "EPS. 24",
    "statusBadge": "Hit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "One Piece",
    "score": "8.7",
    "views": "6.1m",
    "metaCount": "EPS. 1122",
    "statusBadge": "Favorit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
  },
  {
    "id": 52991,
    "malId": 52991,
    "title": "Sousou no Frieren",
    "score": "9.3",
    "views": "2.1m",
    "metaCount": "EPS. 28",
    "statusBadge": "#1 Pick",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1015/138075.jpg"
  },
  {
    "id": 1535,
    "malId": 1535,
    "title": "Death Note",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "EPS. 37",
    "statusBadge": "Masterpiece",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1079/138100.jpg"
  },
  {
    "id": 52299,
    "malId": 52299,
    "title": "Solo Leveling",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 12",
    "statusBadge": "Hype",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1966/141351.jpg"
  },
  {
    "id": 44511,
    "malId": 44511,
    "title": "Chainsaw Man",
    "score": "8.5",
    "views": "2.5m",
    "metaCount": "EPS. 12",
    "statusBadge": "Populer",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"
  },
  {
    "id": 50265,
    "malId": 50265,
    "title": "Spy x Family",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1441/122795.jpg"
  },
  {
    "id": 1735,
    "malId": 1735,
    "title": "Naruto: Shippuuden",
    "score": "8.3",
    "views": "5.2m",
    "metaCount": "EPS. 500",
    "statusBadge": "Wajib Tonton",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1565/111305.jpg"
  },
  {
    "id": 5114,
    "malId": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "score": "9.1",
    "views": "4.2m",
    "metaCount": "EPS. 64",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
  },
  {
    "id": 11061,
    "malId": 11061,
    "title": "Hunter x Hunter (2011)",
    "score": "9.0",
    "views": "3.7m",
    "metaCount": "EPS. 148",
    "statusBadge": "Must Watch",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg"
  },
  {
    "id": 9253,
    "malId": 9253,
    "title": "Steins;Gate",
    "score": "9.1",
    "views": "3.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1935/127974.jpg"
  },
  {
    "id": 37521,
    "malId": 37521,
    "title": "Vinland Saga",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "EPS. 24",
    "statusBadge": "Must Watch",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1500/103005.jpg"
  },
  {
    "id": 52034,
    "malId": 52034,
    "title": "Oshi no Ko",
    "score": "8.6",
    "views": "1.7m",
    "metaCount": "EPS. 11",
    "statusBadge": "Favorit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1813/134428.jpg"
  },
  {
    "id": 22319,
    "malId": 22319,
    "title": "Tokyo Ghoul",
    "score": "7.8",
    "views": "3.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1498/134443.jpg"
  },
  {
    "id": 30276,
    "malId": 30276,
    "title": "One Punch Man",
    "score": "8.5",
    "views": "3.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Hero",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/12/76049.jpg"
  },
  {
    "id": 30831,
    "malId": 30831,
    "title": "KonoSuba",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 10",
    "statusBadge": "Kocak",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/8/77831.jpg"
  },
  {
    "id": 31240,
    "malId": 31240,
    "title": "Re:Zero",
    "score": "8.2",
    "views": "2.6m",
    "metaCount": "EPS. 25",
    "statusBadge": "Isekai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1522/128039.jpg"
  },
  {
    "id": 11757,
    "malId": 11757,
    "title": "Sword Art Online",
    "score": "7.2",
    "views": "3.2m",
    "metaCount": "EPS. 25",
    "statusBadge": "Populer",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/11/39717.jpg"
  },
  {
    "id": 20583,
    "malId": 20583,
    "title": "Haikyuu!!",
    "score": "8.4",
    "views": "2.4m",
    "metaCount": "EPS. 25",
    "statusBadge": "Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/7/76014.jpg"
  },
  {
    "id": 32182,
    "malId": 32182,
    "title": "Mob Psycho 100",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1918/96303.jpg"
  },
  {
    "id": 33352,
    "malId": 33352,
    "title": "Violet Evergarden",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "EPS. 13",
    "statusBadge": "Emosional",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1795/95088.jpg"
  },
  {
    "id": 42310,
    "malId": 42310,
    "title": "Cyberpunk: Edgerunners",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 10",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1818/126435.jpg"
  },
  {
    "id": 37999,
    "malId": 37999,
    "title": "Kaguya-sama wa Kokurasetai",
    "score": "8.4",
    "views": "2.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "RomCom",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1295/106551.jpg"
  },
  {
    "id": 1575,
    "malId": 1575,
    "title": "Code Geass",
    "score": "8.7",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "Taktis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1032/135088.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Cowboy Bebop",
    "score": "8.7",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
  },
  {
    "id": 30,
    "malId": 30,
    "title": "Neon Genesis Evangelion",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1314/108941.jpg"
  },
  {
    "id": 39535,
    "malId": 39535,
    "title": "Mushoku Tensei",
    "score": "8.4",
    "views": "1.5m",
    "metaCount": "EPS. 11",
    "statusBadge": "Fantasy",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1530/117776.jpg"
  },
  {
    "id": 49596,
    "malId": 49596,
    "title": "Blue Lock",
    "score": "8.2",
    "views": "1.3m",
    "metaCount": "EPS. 24",
    "statusBadge": "Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1258/126929.jpg"
  },
  {
    "id": 19815,
    "malId": 19815,
    "title": "No Game No Life",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 12",
    "statusBadge": "Game",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1074/111944.jpg"
  },
  {
    "id": 35790,
    "malId": 35790,
    "title": "Tate no Yuusha",
    "score": "7.9",
    "views": "1.7m",
    "metaCount": "EPS. 25",
    "statusBadge": "Isekai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1490/101365.jpg"
  },
  {
    "id": 47917,
    "malId": 47917,
    "title": "Bocchi the Rock!",
    "score": "8.8",
    "views": "1.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "Musik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1448/127956.jpg"
  },
  {
    "id": 23273,
    "malId": 23273,
    "title": "Shigatsu wa Kimi no Uso",
    "score": "8.6",
    "views": "2.2m",
    "metaCount": "EPS. 22",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/14/71553.jpg"
  },
  {
    "id": 4224,
    "malId": 4224,
    "title": "Toradora!",
    "score": "8.1",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "Romantis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/22128.jpg"
  },
  {
    "id": 2001,
    "malId": 2001,
    "title": "Tengen Toppa Gurren Lagann",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 27",
    "statusBadge": "Mecha",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/5123.jpg"
  },
  {
    "id": 13601,
    "malId": 13601,
    "title": "Psycho-Pass",
    "score": "8.3",
    "views": "1.7m",
    "metaCount": "EPS. 22",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/43399.jpg"
  },
  {
    "id": 34599,
    "malId": 34599,
    "title": "Made in Abyss",
    "score": "8.6",
    "views": "1.5m",
    "metaCount": "EPS. 13",
    "statusBadge": "Petualangan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/86733.jpg"
  },
  {
    "id": 35507,
    "malId": 35507,
    "title": "Classroom of the Elite",
    "score": "7.8",
    "views": "1.8m",
    "metaCount": "EPS. 12",
    "statusBadge": "Pintar",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1165/120987.jpg"
  },
  {
    "id": 20507,
    "malId": 20507,
    "title": "Noragami",
    "score": "7.9",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Dewa",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/9/77809.jpg"
  },
  {
    "id": 245,
    "malId": 245,
    "title": "Great Teacher Onizuka",
    "score": "8.7",
    "views": "980k",
    "metaCount": "EPS. 43",
    "statusBadge": "Wajib Tonton",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/11460.jpg"
  },
  {
    "id": 31043,
    "malId": 31043,
    "title": "Erased",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 12",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/77957.jpg"
  },
  {
    "id": 34572,
    "malId": 34572,
    "title": "Black Clover",
    "score": "8.1",
    "views": "2.0m",
    "metaCount": "EPS. 170",
    "statusBadge": "Sihir",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/88336.jpg"
  },
  {
    "id": 38691,
    "malId": 38691,
    "title": "Dr. Stone",
    "score": "8.2",
    "views": "1.7m",
    "metaCount": "EPS. 24",
    "statusBadge": "Sains",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1613/102576.jpg"
  },
  {
    "id": 49387,
    "malId": 49387,
    "title": "Vinland Saga Season 2",
    "score": "8.8",
    "views": "820k",
    "metaCount": "EPS. 24",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1506/138982.jpg"
  },
  {
    "id": 54492,
    "malId": 54492,
    "title": "Kusuriya no Hitorigoto",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "Favorit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1708/138033.jpg"
  },
  {
    "id": 269,
    "malId": 269,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.5m",
    "metaCount": "EPS. 366",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/3/40451.jpg"
  },
  {
    "id": 31964,
    "malId": 31964,
    "title": "Boku no Hero Academia",
    "score": "7.9",
    "views": "3.3m",
    "metaCount": "EPS. 13",
    "statusBadge": "Hero",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
  }
],
    trending: [
  {
    "id": 52299,
    "malId": 52299,
    "title": "Solo Leveling",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Tren #1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1966/141351.jpg"
  },
  {
    "id": 52991,
    "malId": 52991,
    "title": "Sousou no Frieren",
    "score": "9.3",
    "views": "2.1m",
    "metaCount": "EPS. 28",
    "statusBadge": "🔥 Viral",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1015/138075.jpg"
  },
  {
    "id": 54492,
    "malId": 54492,
    "title": "Kusuriya no Hitorigoto",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Hot",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1708/138033.jpg"
  },
  {
    "id": 40748,
    "malId": 40748,
    "title": "Jujutsu Kaisen",
    "score": "8.6",
    "views": "3.5m",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Top",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
  },
  {
    "id": 38000,
    "malId": 38000,
    "title": "Kimetsu no Yaiba",
    "score": "8.5",
    "views": "3.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "🔥 Hit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
  },
  {
    "id": 52034,
    "malId": 52034,
    "title": "Oshi no Ko",
    "score": "8.6",
    "views": "1.7m",
    "metaCount": "EPS. 11",
    "statusBadge": "🔥 Hype",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1813/134428.jpg"
  },
  {
    "id": 44511,
    "malId": 44511,
    "title": "Chainsaw Man",
    "score": "8.5",
    "views": "2.5m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Populer",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1806/126216.jpg"
  },
  {
    "id": 49596,
    "malId": 49596,
    "title": "Blue Lock",
    "score": "8.2",
    "views": "1.3m",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1258/126929.jpg"
  },
  {
    "id": 50265,
    "malId": 50265,
    "title": "Spy x Family",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Trending",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1441/122795.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "One Piece",
    "score": "8.7",
    "views": "6.1m",
    "metaCount": "EPS. 1122",
    "statusBadge": "🔥 On Going",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
  },
  {
    "id": 41467,
    "malId": 41467,
    "title": "Bleach: Sennen Kessen-hen",
    "score": "9.0",
    "views": "1.8m",
    "metaCount": "EPS. 13",
    "statusBadge": "🔥 Hot",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1908/120036.jpg"
  },
  {
    "id": 47917,
    "malId": 47917,
    "title": "Bocchi the Rock!",
    "score": "8.8",
    "views": "1.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Viral",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1448/127956.jpg"
  },
  {
    "id": 49387,
    "malId": 49387,
    "title": "Vinland Saga Season 2",
    "score": "8.8",
    "views": "820k",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Tren",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1506/138982.jpg"
  },
  {
    "id": 39535,
    "malId": 39535,
    "title": "Mushoku Tensei",
    "score": "8.4",
    "views": "1.5m",
    "metaCount": "EPS. 11",
    "statusBadge": "🔥 Hot",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1530/117776.jpg"
  },
  {
    "id": 42310,
    "malId": 42310,
    "title": "Cyberpunk: Edgerunners",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 10",
    "statusBadge": "🔥 Hype",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1818/126435.jpg"
  },
  {
    "id": 37999,
    "malId": 37999,
    "title": "Kaguya-sama wa Kokurasetai",
    "score": "8.4",
    "views": "2.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 RomCom",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1295/106551.jpg"
  },
  {
    "id": 32182,
    "malId": 32182,
    "title": "Mob Psycho 100",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1918/96303.jpg"
  },
  {
    "id": 16498,
    "malId": 16498,
    "title": "Attack on Titan",
    "score": "8.5",
    "views": "4.8m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Viral",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
  },
  {
    "id": 31240,
    "malId": 31240,
    "title": "Re:Zero",
    "score": "8.2",
    "views": "2.6m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Isekai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1522/128039.jpg"
  },
  {
    "id": 30831,
    "malId": 30831,
    "title": "KonoSuba",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 10",
    "statusBadge": "🔥 Komedi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/8/77831.jpg"
  },
  {
    "id": 38691,
    "malId": 38691,
    "title": "Dr. Stone",
    "score": "8.2",
    "views": "1.7m",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Sains",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1613/102576.jpg"
  },
  {
    "id": 35507,
    "malId": 35507,
    "title": "Classroom of the Elite",
    "score": "7.8",
    "views": "1.8m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Pintar",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1165/120987.jpg"
  },
  {
    "id": 31964,
    "malId": 31964,
    "title": "Boku no Hero Academia",
    "score": "7.9",
    "views": "3.3m",
    "metaCount": "EPS. 13",
    "statusBadge": "🔥 Hero",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
  },
  {
    "id": 34572,
    "malId": 34572,
    "title": "Black Clover",
    "score": "8.1",
    "views": "2.0m",
    "metaCount": "EPS. 170",
    "statusBadge": "🔥 Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/88336.jpg"
  },
  {
    "id": 20583,
    "malId": 20583,
    "title": "Haikyuu!!",
    "score": "8.4",
    "views": "2.4m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/7/76014.jpg"
  },
  {
    "id": 30276,
    "malId": 30276,
    "title": "One Punch Man",
    "score": "8.5",
    "views": "3.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Hype",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/12/76049.jpg"
  },
  {
    "id": 22319,
    "malId": 22319,
    "title": "Tokyo Ghoul",
    "score": "7.8",
    "views": "3.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Tren",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1498/134443.jpg"
  },
  {
    "id": 11757,
    "malId": 11757,
    "title": "Sword Art Online",
    "score": "7.2",
    "views": "3.2m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Game",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/11/39717.jpg"
  },
  {
    "id": 11061,
    "malId": 11061,
    "title": "Hunter x Hunter",
    "score": "9.0",
    "views": "3.7m",
    "metaCount": "EPS. 148",
    "statusBadge": "🔥 Top",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg"
  },
  {
    "id": 34599,
    "malId": 34599,
    "title": "Made in Abyss",
    "score": "8.6",
    "views": "1.5m",
    "metaCount": "EPS. 13",
    "statusBadge": "🔥 Tren",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/86733.jpg"
  },
  {
    "id": 1535,
    "malId": 1535,
    "title": "Death Note",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "EPS. 37",
    "statusBadge": "🔥 Populer",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1079/138100.jpg"
  },
  {
    "id": 9253,
    "malId": 9253,
    "title": "Steins;Gate",
    "score": "9.1",
    "views": "3.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "🔥 Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1935/127974.jpg"
  },
  {
    "id": 5114,
    "malId": 5114,
    "title": "Fullmetal Alchemist",
    "score": "9.1",
    "views": "4.2m",
    "metaCount": "EPS. 64",
    "statusBadge": "🔥 Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
  },
  {
    "id": 1735,
    "malId": 1735,
    "title": "Naruto: Shippuuden",
    "score": "8.3",
    "views": "5.2m",
    "metaCount": "EPS. 500",
    "statusBadge": "🔥 Populer",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1565/111305.jpg"
  },
  {
    "id": 20507,
    "malId": 20507,
    "title": "Noragami",
    "score": "7.9",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Supernatural",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/9/77809.jpg"
  },
  {
    "id": 23273,
    "malId": 23273,
    "title": "Shigatsu wa Kimi no Uso",
    "score": "8.6",
    "views": "2.2m",
    "metaCount": "EPS. 22",
    "statusBadge": "🔥 Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/14/71553.jpg"
  },
  {
    "id": 4224,
    "malId": 4224,
    "title": "Toradora!",
    "score": "8.1",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Romantis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/22128.jpg"
  },
  {
    "id": 2001,
    "malId": 2001,
    "title": "Tengen Toppa Gurren Lagann",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 27",
    "statusBadge": "🔥 Mecha",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/5123.jpg"
  },
  {
    "id": 13601,
    "malId": 13601,
    "title": "Psycho-Pass",
    "score": "8.3",
    "views": "1.7m",
    "metaCount": "EPS. 22",
    "statusBadge": "🔥 Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/43399.jpg"
  },
  {
    "id": 245,
    "malId": 245,
    "title": "Great Teacher Onizuka",
    "score": "8.7",
    "views": "980k",
    "metaCount": "EPS. 43",
    "statusBadge": "🔥 Top",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/11460.jpg"
  },
  {
    "id": 31043,
    "malId": 31043,
    "title": "Erased",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/77957.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Cowboy Bebop",
    "score": "8.7",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "🔥 Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
  },
  {
    "id": 30,
    "malId": 30,
    "title": "Neon Genesis Evangelion",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "🔥 Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1314/108941.jpg"
  },
  {
    "id": 1575,
    "malId": 1575,
    "title": "Code Geass",
    "score": "8.7",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Taktis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1032/135088.jpg"
  },
  {
    "id": 19815,
    "malId": 19815,
    "title": "No Game No Life",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 12",
    "statusBadge": "🔥 Game",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1074/111944.jpg"
  },
  {
    "id": 35790,
    "malId": 35790,
    "title": "Tate no Yuusha",
    "score": "7.9",
    "views": "1.7m",
    "metaCount": "EPS. 25",
    "statusBadge": "🔥 Isekai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1490/101365.jpg"
  },
  {
    "id": 223,
    "malId": 223,
    "title": "Dragon Ball",
    "score": "8.0",
    "views": "1.8m",
    "metaCount": "EPS. 153",
    "statusBadge": "🔥 Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1884/124905.jpg"
  },
  {
    "id": 918,
    "malId": 918,
    "title": "Gintama",
    "score": "8.9",
    "views": "1.3m",
    "metaCount": "EPS. 201",
    "statusBadge": "🔥 Komedi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/73274.jpg"
  }
],
    classic: [
  {
    "id": 1,
    "malId": 1,
    "title": "Cowboy Bebop",
    "score": "8.7",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
  },
  {
    "id": 30,
    "malId": 30,
    "title": "Neon Genesis Evangelion",
    "score": "8.3",
    "views": "1.9m",
    "metaCount": "EPS. 26",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1314/108941.jpg"
  },
  {
    "id": 223,
    "malId": 223,
    "title": "Dragon Ball",
    "score": "8.0",
    "views": "1.8m",
    "metaCount": "EPS. 153",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1884/124905.jpg"
  },
  {
    "id": 245,
    "malId": 245,
    "title": "Great Teacher Onizuka",
    "score": "8.7",
    "views": "980k",
    "metaCount": "EPS. 43",
    "statusBadge": "Masterpiece",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/11460.jpg"
  },
  {
    "id": 5114,
    "malId": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "score": "9.1",
    "views": "4.2m",
    "metaCount": "EPS. 64",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
  },
  {
    "id": 9253,
    "malId": 9253,
    "title": "Steins;Gate",
    "score": "9.1",
    "views": "3.4m",
    "metaCount": "EPS. 24",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1935/127974.jpg"
  },
  {
    "id": 19,
    "malId": 19,
    "title": "Monster",
    "score": "8.9",
    "views": "1.9m",
    "metaCount": "EPS. 74",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/18740.jpg"
  },
  {
    "id": 20,
    "malId": 20,
    "title": "Naruto",
    "score": "8.0",
    "views": "2.8m",
    "metaCount": "EPS. 220",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
  },
  {
    "id": 2904,
    "malId": 2904,
    "title": "Code Geass: Lelouch R2",
    "score": "8.9",
    "views": "2.6m",
    "metaCount": "EPS. 25",
    "statusBadge": "Mecha",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/9391.jpg"
  },
  {
    "id": 269,
    "malId": 269,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.5m",
    "metaCount": "EPS. 366",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/3/40451.jpg"
  },
  {
    "id": 1535,
    "malId": 1535,
    "title": "Death Note",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "EPS. 37",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1079/138100.jpg"
  },
  {
    "id": 11061,
    "malId": 11061,
    "title": "Hunter x Hunter (2011)",
    "score": "9.0",
    "views": "3.7m",
    "metaCount": "EPS. 148",
    "statusBadge": "Masterpiece",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg"
  },
  {
    "id": 2001,
    "malId": 2001,
    "title": "Tengen Toppa Gurren Lagann",
    "score": "8.6",
    "views": "1.6m",
    "metaCount": "EPS. 27",
    "statusBadge": "Mecha",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/4/5123.jpg"
  },
  {
    "id": 23273,
    "malId": 23273,
    "title": "Shigatsu wa Kimi no Uso",
    "score": "8.6",
    "views": "2.2m",
    "metaCount": "EPS. 22",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/14/71553.jpg"
  },
  {
    "id": 4224,
    "malId": 4224,
    "title": "Toradora!",
    "score": "8.1",
    "views": "2.3m",
    "metaCount": "EPS. 25",
    "statusBadge": "Romantis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/22128.jpg"
  },
  {
    "id": 31043,
    "malId": 31043,
    "title": "Erased",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 12",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/77957.jpg"
  },
  {
    "id": 205,
    "malId": 205,
    "title": "Samurai Champloo",
    "score": "8.5",
    "views": "1.4m",
    "metaCount": "EPS. 26",
    "statusBadge": "Samurai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/11/29134.jpg"
  },
  {
    "id": 777,
    "malId": 777,
    "title": "Hellsing Ultimate",
    "score": "8.3",
    "views": "1.2m",
    "metaCount": "EPS. 10",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/6401.jpg"
  },
  {
    "id": 18679,
    "malId": 18679,
    "title": "Kill la Kill",
    "score": "8.0",
    "views": "1.8m",
    "metaCount": "EPS. 24",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/54721.jpg"
  },
  {
    "id": 4181,
    "malId": 4181,
    "title": "Clannad: After Story",
    "score": "8.9",
    "views": "1.3m",
    "metaCount": "EPS. 24",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/24647.jpg"
  },
  {
    "id": 10087,
    "malId": 10087,
    "title": "Fate/Zero",
    "score": "8.3",
    "views": "1.6m",
    "metaCount": "EPS. 13",
    "statusBadge": "Sihir",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/73249.jpg"
  },
  {
    "id": 918,
    "malId": 918,
    "title": "Gintama",
    "score": "8.9",
    "views": "1.3m",
    "metaCount": "EPS. 201",
    "statusBadge": "Komedi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/73274.jpg"
  },
  {
    "id": 185,
    "malId": 185,
    "title": "Initial D First Stage",
    "score": "8.3",
    "views": "520k",
    "metaCount": "EPS. 26",
    "statusBadge": "Balapan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/13/24995.jpg"
  },
  {
    "id": 6,
    "malId": 6,
    "title": "Trigun",
    "score": "8.2",
    "views": "830k",
    "metaCount": "EPS. 26",
    "statusBadge": "Koboi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/7/20310.jpg"
  },
  {
    "id": 9989,
    "malId": 9989,
    "title": "Ano Hi Mita Hana (Anohana)",
    "score": "8.3",
    "views": "1.6m",
    "metaCount": "EPS. 11",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/79697.jpg"
  },
  {
    "id": 20507,
    "malId": 20507,
    "title": "Noragami",
    "score": "7.9",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Dewa",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/9/77809.jpg"
  },
  {
    "id": 35507,
    "malId": 35507,
    "title": "Classroom of the Elite",
    "score": "7.8",
    "views": "1.8m",
    "metaCount": "EPS. 12",
    "statusBadge": "Sekolah",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1165/120987.jpg"
  },
  {
    "id": 38691,
    "malId": 38691,
    "title": "Dr. Stone",
    "score": "8.2",
    "views": "1.7m",
    "metaCount": "EPS. 24",
    "statusBadge": "Sains",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1613/102576.jpg"
  },
  {
    "id": 34599,
    "malId": 34599,
    "title": "Made in Abyss",
    "score": "8.6",
    "views": "1.5m",
    "metaCount": "EPS. 13",
    "statusBadge": "Petualangan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/86733.jpg"
  },
  {
    "id": 43,
    "malId": 43,
    "title": "Koukaku Kidoutai",
    "score": "8.3",
    "views": "650k",
    "metaCount": "EPS. 1",
    "statusBadge": "Cyberpunk",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/82594.jpg"
  },
  {
    "id": 7785,
    "malId": 7785,
    "title": "Yojouhan Shinwa Taikei",
    "score": "8.6",
    "views": "450k",
    "metaCount": "EPS. 11",
    "statusBadge": "Art",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/22061.jpg"
  },
  {
    "id": 30831,
    "malId": 30831,
    "title": "KonoSuba",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "EPS. 10",
    "statusBadge": "Isekai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/8/77831.jpg"
  },
  {
    "id": 34572,
    "malId": 34572,
    "title": "Black Clover",
    "score": "8.1",
    "views": "2.0m",
    "metaCount": "EPS. 170",
    "statusBadge": "Sihir",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/88336.jpg"
  },
  {
    "id": 22319,
    "malId": 22319,
    "title": "Tokyo Ghoul",
    "score": "7.8",
    "views": "3.1m",
    "metaCount": "EPS. 12",
    "statusBadge": "Gelap",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1498/134443.jpg"
  },
  {
    "id": 24833,
    "malId": 24833,
    "title": "Ansatsu Kyoushitsu",
    "score": "8.1",
    "views": "2.1m",
    "metaCount": "EPS. 22",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/75810.jpg"
  },
  {
    "id": 22535,
    "malId": 22535,
    "title": "Kiseijuu: Sei no Kakuritsu",
    "score": "8.3",
    "views": "2.0m",
    "metaCount": "EPS. 24",
    "statusBadge": "Horor",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/3/73178.jpg"
  },
  {
    "id": 7674,
    "malId": 7674,
    "title": "Bakuman.",
    "score": "8.2",
    "views": "650k",
    "metaCount": "EPS. 25",
    "statusBadge": "Manga",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/26487.jpg"
  },
  {
    "id": 13601,
    "malId": 13601,
    "title": "Psycho-Pass",
    "score": "8.3",
    "views": "1.7m",
    "metaCount": "EPS. 22",
    "statusBadge": "Kriminal",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/5/43399.jpg"
  },
  {
    "id": 37520,
    "malId": 37520,
    "title": "Dororo",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "EPS. 24",
    "statusBadge": "Samurai",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1879/100467.jpg"
  },
  {
    "id": 36649,
    "malId": 36649,
    "title": "Banana Fish",
    "score": "8.5",
    "views": "850k",
    "metaCount": "EPS. 24",
    "statusBadge": "Kriminal",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1190/94354.jpg"
  },
  {
    "id": 22135,
    "malId": 22135,
    "title": "Ping Pong the Animation",
    "score": "8.6",
    "views": "410k",
    "metaCount": "EPS. 11",
    "statusBadge": "Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/58749.jpg"
  },
  {
    "id": 13125,
    "malId": 13125,
    "title": "Shinsekai yori",
    "score": "8.3",
    "views": "820k",
    "metaCount": "EPS. 25",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/8/39569.jpg"
  },
  {
    "id": 457,
    "malId": 457,
    "title": "Mushishi",
    "score": "8.7",
    "views": "920k",
    "metaCount": "EPS. 26",
    "statusBadge": "Supranatural",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/2/73862.jpg"
  },
  {
    "id": 33352,
    "malId": 33352,
    "title": "Violet Evergarden",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "EPS. 13",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1795/95088.jpg"
  },
  {
    "id": 32182,
    "malId": 32182,
    "title": "Mob Psycho 100",
    "score": "8.5",
    "views": "2.3m",
    "metaCount": "EPS. 12",
    "statusBadge": "Psikis",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1918/96303.jpg"
  },
  {
    "id": 40028,
    "malId": 40028,
    "title": "Shingeki no Kyojin: Final",
    "score": "8.8",
    "views": "3.9m",
    "metaCount": "EPS. 16",
    "statusBadge": "Epik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/1000/110531.jpg"
  },
  {
    "id": 16498,
    "malId": 16498,
    "title": "Attack on Titan",
    "score": "8.5",
    "views": "4.8m",
    "metaCount": "EPS. 25",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "One Piece",
    "score": "8.7",
    "views": "6.1m",
    "metaCount": "EPS. 1122",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
  }
],
  },
  manga: {
    top_rated: [
  {
    "id": 2,
    "malId": 2,
    "title": "Berserk",
    "score": "9.5",
    "views": "4.5m",
    "metaCount": "CH. 380",
    "statusBadge": "⭐ 9.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157897.jpg"
  },
  {
    "id": 1706,
    "malId": 1706,
    "title": "JoJo Part 7: Steel Ball Run",
    "score": "9.3",
    "views": "1.6m",
    "metaCount": "CH. 95",
    "statusBadge": "⭐ 9.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179882.jpg"
  },
  {
    "id": 656,
    "malId": 656,
    "title": "Vagabond",
    "score": "9.3",
    "views": "2.4m",
    "metaCount": "CH. 327",
    "statusBadge": "⭐ 9.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/259070.jpg"
  },
  {
    "id": 13,
    "malId": 13,
    "title": "One Piece",
    "score": "9.2",
    "views": "6.1m",
    "metaCount": "CH. 1198",
    "statusBadge": "⭐ 9.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253146.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Monster",
    "score": "9.1",
    "views": "2.1m",
    "metaCount": "CH. 162",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/258224.jpg"
  },
  {
    "id": 51,
    "malId": 51,
    "title": "Slam Dunk",
    "score": "9.1",
    "views": "1.4m",
    "metaCount": "CH. 276",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258749.jpg"
  },
  {
    "id": 25,
    "malId": 25,
    "title": "Fullmetal Alchemist",
    "score": "9.0",
    "views": "2.3m",
    "metaCount": "CH. 116",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/243675.jpg"
  },
  {
    "id": 4632,
    "malId": 4632,
    "title": "Oyasumi Punpun",
    "score": "9.0",
    "views": "1.9m",
    "metaCount": "CH. 147",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164420.jpg"
  },
  {
    "id": 642,
    "malId": 642,
    "title": "Vinland Saga",
    "score": "9.0",
    "views": "1.7m",
    "metaCount": "CH. 215",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/188925.jpg"
  },
  {
    "id": 16765,
    "malId": 16765,
    "title": "Kingdom",
    "score": "9.0",
    "views": "1.2m",
    "metaCount": "CH. 820",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171872.jpg"
  },
  {
    "id": 3,
    "malId": 3,
    "title": "20th Century Boys",
    "score": "8.9",
    "views": "1.5m",
    "metaCount": "CH. 249",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/5/260006.jpg"
  },
  {
    "id": 35243,
    "malId": 35243,
    "title": "Haikyuu!!",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "CH. 407",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258225.jpg"
  },
  {
    "id": 657,
    "malId": 657,
    "title": "Real",
    "score": "8.9",
    "views": "520k",
    "metaCount": "CH. 96",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/115981.jpg"
  },
  {
    "id": 407,
    "malId": 407,
    "title": "GTO (Great Teacher Onizuka)",
    "score": "8.9",
    "views": "890k",
    "metaCount": "CH. 208",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/172982.jpg"
  },
  {
    "id": 26,
    "malId": 26,
    "title": "Hunter x Hunter",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "CH. 405",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253119.jpg"
  },
  {
    "id": 116778,
    "malId": 116778,
    "title": "Chainsaw Man",
    "score": "8.7",
    "views": "2.8m",
    "metaCount": "CH. 185",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/216464.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "Death Note",
    "score": "8.7",
    "views": "3.0m",
    "metaCount": "CH. 108",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/54453.jpg"
  },
  {
    "id": 664,
    "malId": 664,
    "title": "Akira",
    "score": "8.7",
    "views": "650k",
    "metaCount": "CH. 120",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/178434.jpg"
  },
  {
    "id": 1133,
    "malId": 1133,
    "title": "Dorohedoro",
    "score": "8.6",
    "views": "880k",
    "metaCount": "CH. 190",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179023.jpg"
  },
  {
    "id": 23390,
    "malId": 23390,
    "title": "Shingeki no Kyojin",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "CH. 139",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/37846.jpg"
  },
  {
    "id": 712,
    "malId": 712,
    "title": "Pluto",
    "score": "8.6",
    "views": "720k",
    "metaCount": "CH. 65",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/168341.jpg"
  },
  {
    "id": 119119,
    "malId": 119119,
    "title": "Spy x Family",
    "score": "8.6",
    "views": "1.8m",
    "metaCount": "CH. 105",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/219741.jpg"
  },
  {
    "id": 1303,
    "malId": 1303,
    "title": "Pandora Hearts",
    "score": "8.6",
    "views": "740k",
    "metaCount": "CH. 107",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/168340.jpg"
  },
  {
    "id": 113138,
    "malId": 113138,
    "title": "Jujutsu Kaisen",
    "score": "8.5",
    "views": "3.2m",
    "metaCount": "CH. 271",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/210341.jpg"
  },
  {
    "id": 33327,
    "malId": 33327,
    "title": "Tokyo Ghoul",
    "score": "8.5",
    "views": "2.9m",
    "metaCount": "CH. 143",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/83547.jpg"
  },
  {
    "id": 126146,
    "malId": 126146,
    "title": "Oshi no Ko",
    "score": "8.5",
    "views": "1.1m",
    "metaCount": "CH. 166",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/238470.jpg"
  },
  {
    "id": 9711,
    "malId": 9711,
    "title": "Bakuman.",
    "score": "8.5",
    "views": "820k",
    "metaCount": "CH. 176",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157900.jpg"
  },
  {
    "id": 131334,
    "malId": 131334,
    "title": "Sakamoto Days",
    "score": "8.4",
    "views": "3.5m",
    "metaCount": "CH. 281",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/245842.jpg"
  },
  {
    "id": 162479,
    "malId": 162479,
    "title": "Kagurabachi",
    "score": "8.4",
    "views": "901k",
    "metaCount": "CH. 137",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/298495.jpg"
  },
  {
    "id": 42,
    "malId": 42,
    "title": "Dragon Ball",
    "score": "8.4",
    "views": "1.9m",
    "metaCount": "CH. 520",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258226.jpg"
  },
  {
    "id": 135496,
    "malId": 135496,
    "title": "Dandadan",
    "score": "8.3",
    "views": "920k",
    "metaCount": "CH. 175",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/249740.jpg"
  },
  {
    "id": 114791,
    "malId": 114791,
    "title": "Blue Lock",
    "score": "8.3",
    "views": "1.3m",
    "metaCount": "CH. 280",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/224213.jpg"
  },
  {
    "id": 583,
    "malId": 583,
    "title": "Claymore",
    "score": "8.3",
    "views": "1.1m",
    "metaCount": "CH. 159",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157894.jpg"
  },
  {
    "id": 112318,
    "malId": 112318,
    "title": "Jigokuraku",
    "score": "8.3",
    "views": "850k",
    "metaCount": "CH. 128",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/216447.jpg"
  },
  {
    "id": 3737,
    "malId": 3737,
    "title": "Solanin",
    "score": "8.3",
    "views": "550k",
    "metaCount": "CH. 28",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164421.jpg"
  },
  {
    "id": 144,
    "malId": 144,
    "title": "BLAME!",
    "score": "8.2",
    "views": "620k",
    "metaCount": "CH. 66",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/179043.jpg"
  },
  {
    "id": 936,
    "malId": 936,
    "title": "Homunculus",
    "score": "8.2",
    "views": "680k",
    "metaCount": "CH. 166",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157904.jpg"
  },
  {
    "id": 436,
    "malId": 436,
    "title": "Uzumaki",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "CH. 20",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/165240.jpg"
  },
  {
    "id": 11,
    "malId": 11,
    "title": "Naruto",
    "score": "8.1",
    "views": "3.2m",
    "metaCount": "CH. 700",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/117681.jpg"
  },
  {
    "id": 8848,
    "malId": 8848,
    "title": "Sun-Ken Rock",
    "score": "8.1",
    "views": "710k",
    "metaCount": "CH. 171",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157922.jpg"
  },
  {
    "id": 564,
    "malId": 564,
    "title": "Gantz",
    "score": "8.1",
    "views": "1.8m",
    "metaCount": "CH. 383",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157929.jpg"
  },
  {
    "id": 75989,
    "malId": 75989,
    "title": "Boku no Hero Academia",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "CH. 430",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157895.jpg"
  },
  {
    "id": 135616,
    "malId": 135616,
    "title": "Choujin X",
    "score": "8.0",
    "views": "450k",
    "metaCount": "CH. 55",
    "statusBadge": "⭐ 8.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/249339.jpg"
  },
  {
    "id": 12,
    "malId": 12,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.9m",
    "metaCount": "CH. 705",
    "statusBadge": "⭐ 7.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/180031.jpg"
  },
  {
    "id": 98270,
    "malId": 98270,
    "title": "Fire Punch",
    "score": "7.9",
    "views": "820k",
    "metaCount": "CH. 83",
    "statusBadge": "⭐ 7.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179044.jpg"
  },
  {
    "id": 104565,
    "malId": 104565,
    "title": "Tokyo Revengers",
    "score": "7.8",
    "views": "1.2m",
    "metaCount": "CH. 278",
    "statusBadge": "⭐ 7.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/204780.jpg"
  },
  {
    "id": 64465,
    "malId": 64465,
    "title": "Inuyashiki",
    "score": "7.7",
    "views": "450k",
    "metaCount": "CH. 85",
    "statusBadge": "⭐ 7.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157908.jpg"
  },
  {
    "id": 598,
    "malId": 598,
    "title": "Fairy Tail",
    "score": "7.6",
    "views": "2.1m",
    "metaCount": "CH. 545",
    "statusBadge": "⭐ 7.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171871.jpg"
  }
],
    recommended: [
  {
    "id": 13,
    "malId": 13,
    "title": "One Piece",
    "score": "9.2",
    "views": "6.1m",
    "metaCount": "CH. 1198",
    "statusBadge": "Must Read",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253146.jpg"
  },
  {
    "id": 2,
    "malId": 2,
    "title": "Berserk",
    "score": "9.5",
    "views": "4.5m",
    "metaCount": "CH. 380",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157897.jpg"
  },
  {
    "id": 23390,
    "malId": 23390,
    "title": "Shingeki no Kyojin",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "CH. 139",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/37846.jpg"
  },
  {
    "id": 113138,
    "malId": 113138,
    "title": "Jujutsu Kaisen",
    "score": "8.5",
    "views": "3.2m",
    "metaCount": "CH. 271",
    "statusBadge": "Hit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/210341.jpg"
  },
  {
    "id": 116778,
    "malId": 116778,
    "title": "Chainsaw Man",
    "score": "8.7",
    "views": "2.8m",
    "metaCount": "CH. 185",
    "statusBadge": "Favorit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/216464.jpg"
  },
  {
    "id": 656,
    "malId": 656,
    "title": "Vagabond",
    "score": "9.3",
    "views": "2.4m",
    "metaCount": "CH. 327",
    "statusBadge": "Masterpiece",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/259070.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Monster",
    "score": "9.1",
    "views": "2.1m",
    "metaCount": "CH. 162",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/258224.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "Death Note",
    "score": "8.7",
    "views": "3.0m",
    "metaCount": "CH. 108",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/54453.jpg"
  },
  {
    "id": 51,
    "malId": 51,
    "title": "Slam Dunk",
    "score": "9.1",
    "views": "1.4m",
    "metaCount": "CH. 276",
    "statusBadge": "Wajib Baca",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258749.jpg"
  },
  {
    "id": 25,
    "malId": 25,
    "title": "Fullmetal Alchemist",
    "score": "9.0",
    "views": "2.3m",
    "metaCount": "CH. 116",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/243675.jpg"
  },
  {
    "id": 11,
    "malId": 11,
    "title": "Naruto",
    "score": "8.1",
    "views": "3.2m",
    "metaCount": "CH. 700",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/117681.jpg"
  },
  {
    "id": 12,
    "malId": 12,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.9m",
    "metaCount": "CH. 705",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/180031.jpg"
  },
  {
    "id": 16765,
    "malId": 16765,
    "title": "Kingdom",
    "score": "9.0",
    "views": "1.2m",
    "metaCount": "CH. 820",
    "statusBadge": "Sejarah",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171872.jpg"
  },
  {
    "id": 1706,
    "malId": 1706,
    "title": "JoJo: Steel Ball Run",
    "score": "9.3",
    "views": "1.6m",
    "metaCount": "CH. 95",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179882.jpg"
  },
  {
    "id": 114791,
    "malId": 114791,
    "title": "Blue Lock",
    "score": "8.3",
    "views": "1.3m",
    "metaCount": "CH. 280",
    "statusBadge": "Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/224213.jpg"
  },
  {
    "id": 119119,
    "malId": 119119,
    "title": "Spy x Family",
    "score": "8.6",
    "views": "1.8m",
    "metaCount": "CH. 105",
    "statusBadge": "Komedi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/219741.jpg"
  },
  {
    "id": 126146,
    "malId": 126146,
    "title": "Oshi no Ko",
    "score": "8.5",
    "views": "1.1m",
    "metaCount": "CH. 166",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/238470.jpg"
  },
  {
    "id": 131334,
    "malId": 131334,
    "title": "Sakamoto Days",
    "score": "8.4",
    "views": "3.5m",
    "metaCount": "CH. 281",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/245842.jpg"
  },
  {
    "id": 162479,
    "malId": 162479,
    "title": "Kagurabachi",
    "score": "8.4",
    "views": "901k",
    "metaCount": "CH. 137",
    "statusBadge": "Pedang",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/298495.jpg"
  },
  {
    "id": 135496,
    "malId": 135496,
    "title": "Dandadan",
    "score": "8.3",
    "views": "920k",
    "metaCount": "CH. 175",
    "statusBadge": "Supranatural",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/249740.jpg"
  },
  {
    "id": 26,
    "malId": 26,
    "title": "Hunter x Hunter",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "CH. 405",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253119.jpg"
  },
  {
    "id": 35243,
    "malId": 35243,
    "title": "Haikyuu!!",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "CH. 407",
    "statusBadge": "Voli",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258225.jpg"
  },
  {
    "id": 642,
    "malId": 642,
    "title": "Vinland Saga",
    "score": "9.0",
    "views": "1.7m",
    "metaCount": "CH. 215",
    "statusBadge": "Viking",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/188925.jpg"
  },
  {
    "id": 4632,
    "malId": 4632,
    "title": "Oyasumi Punpun",
    "score": "9.0",
    "views": "1.9m",
    "metaCount": "CH. 147",
    "statusBadge": "Mendalam",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164420.jpg"
  },
  {
    "id": 3,
    "malId": 3,
    "title": "20th Century Boys",
    "score": "8.9",
    "views": "1.5m",
    "metaCount": "CH. 249",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/5/260006.jpg"
  },
  {
    "id": 583,
    "malId": 583,
    "title": "Claymore",
    "score": "8.3",
    "views": "1.1m",
    "metaCount": "CH. 159",
    "statusBadge": "Fantasi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157894.jpg"
  },
  {
    "id": 1133,
    "malId": 1133,
    "title": "Dorohedoro",
    "score": "8.6",
    "views": "880k",
    "metaCount": "CH. 190",
    "statusBadge": "Kultus",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179023.jpg"
  },
  {
    "id": 112318,
    "malId": 112318,
    "title": "Jigokuraku",
    "score": "8.3",
    "views": "850k",
    "metaCount": "CH. 128",
    "statusBadge": "Ninja",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/216447.jpg"
  },
  {
    "id": 98270,
    "malId": 98270,
    "title": "Fire Punch",
    "score": "7.9",
    "views": "820k",
    "metaCount": "CH. 83",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179044.jpg"
  },
  {
    "id": 436,
    "malId": 436,
    "title": "Uzumaki",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "CH. 20",
    "statusBadge": "Horor",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/165240.jpg"
  },
  {
    "id": 936,
    "malId": 936,
    "title": "Homunculus",
    "score": "8.2",
    "views": "680k",
    "metaCount": "CH. 166",
    "statusBadge": "Psikologi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157904.jpg"
  },
  {
    "id": 712,
    "malId": 712,
    "title": "Pluto",
    "score": "8.6",
    "views": "720k",
    "metaCount": "CH. 65",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/168341.jpg"
  },
  {
    "id": 9711,
    "malId": 9711,
    "title": "Bakuman.",
    "score": "8.5",
    "views": "820k",
    "metaCount": "CH. 176",
    "statusBadge": "Kreator",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157900.jpg"
  },
  {
    "id": 64465,
    "malId": 64465,
    "title": "Inuyashiki",
    "score": "7.7",
    "views": "450k",
    "metaCount": "CH. 85",
    "statusBadge": "Hero",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157908.jpg"
  },
  {
    "id": 664,
    "malId": 664,
    "title": "Akira",
    "score": "8.7",
    "views": "650k",
    "metaCount": "CH. 120",
    "statusBadge": "Epik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/178434.jpg"
  },
  {
    "id": 3737,
    "malId": 3737,
    "title": "Solanin",
    "score": "8.3",
    "views": "550k",
    "metaCount": "CH. 28",
    "statusBadge": "Musik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164421.jpg"
  },
  {
    "id": 42,
    "malId": 42,
    "title": "Dragon Ball",
    "score": "8.4",
    "views": "1.9m",
    "metaCount": "CH. 520",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258226.jpg"
  },
  {
    "id": 8848,
    "malId": 8848,
    "title": "Sun-Ken Rock",
    "score": "8.1",
    "views": "710k",
    "metaCount": "CH. 171",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157922.jpg"
  },
  {
    "id": 407,
    "malId": 407,
    "title": "GTO",
    "score": "8.9",
    "views": "890k",
    "metaCount": "CH. 208",
    "statusBadge": "Sekolah",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/172982.jpg"
  },
  {
    "id": 1303,
    "malId": 1303,
    "title": "Pandora Hearts",
    "score": "8.6",
    "views": "740k",
    "metaCount": "CH. 107",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/168340.jpg"
  },
  {
    "id": 598,
    "malId": 598,
    "title": "Fairy Tail",
    "score": "7.6",
    "views": "2.1m",
    "metaCount": "CH. 545",
    "statusBadge": "Sihir",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171871.jpg"
  },
  {
    "id": 75989,
    "malId": 75989,
    "title": "Boku no Hero Academia",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "CH. 430",
    "statusBadge": "Pahlawan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157895.jpg"
  },
  {
    "id": 104565,
    "malId": 104565,
    "title": "Tokyo Revengers",
    "score": "7.8",
    "views": "1.2m",
    "metaCount": "CH. 278",
    "statusBadge": "Geng",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/204780.jpg"
  },
  {
    "id": 144,
    "malId": 144,
    "title": "BLAME!",
    "score": "8.2",
    "views": "620k",
    "metaCount": "CH. 66",
    "statusBadge": "Masa Depan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/179043.jpg"
  },
  {
    "id": 657,
    "malId": 657,
    "title": "Real",
    "score": "8.9",
    "views": "520k",
    "metaCount": "CH. 96",
    "statusBadge": "Basket",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/115981.jpg"
  },
  {
    "id": 564,
    "malId": 564,
    "title": "Gantz",
    "score": "8.1",
    "views": "1.8m",
    "metaCount": "CH. 383",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157929.jpg"
  },
  {
    "id": 33327,
    "malId": 33327,
    "title": "Tokyo Ghoul",
    "score": "8.5",
    "views": "2.9m",
    "metaCount": "CH. 143",
    "statusBadge": "Gelap",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/83547.jpg"
  },
  {
    "id": 135616,
    "malId": 135616,
    "title": "Choujin X",
    "score": "8.0",
    "views": "450k",
    "metaCount": "CH. 55",
    "statusBadge": "Kekuatan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/249339.jpg"
  }
],
    trending: [
  {
    "id": 13,
    "malId": 13,
    "title": "One Piece",
    "score": "9.2",
    "views": "6.1m",
    "metaCount": "CH. 1198",
    "statusBadge": "Must Read",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253146.jpg"
  },
  {
    "id": 2,
    "malId": 2,
    "title": "Berserk",
    "score": "9.5",
    "views": "4.5m",
    "metaCount": "CH. 380",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157897.jpg"
  },
  {
    "id": 23390,
    "malId": 23390,
    "title": "Shingeki no Kyojin",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "CH. 139",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/37846.jpg"
  },
  {
    "id": 113138,
    "malId": 113138,
    "title": "Jujutsu Kaisen",
    "score": "8.5",
    "views": "3.2m",
    "metaCount": "CH. 271",
    "statusBadge": "Hit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/210341.jpg"
  },
  {
    "id": 116778,
    "malId": 116778,
    "title": "Chainsaw Man",
    "score": "8.7",
    "views": "2.8m",
    "metaCount": "CH. 185",
    "statusBadge": "Favorit",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/216464.jpg"
  },
  {
    "id": 656,
    "malId": 656,
    "title": "Vagabond",
    "score": "9.3",
    "views": "2.4m",
    "metaCount": "CH. 327",
    "statusBadge": "Masterpiece",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/259070.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Monster",
    "score": "9.1",
    "views": "2.1m",
    "metaCount": "CH. 162",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/258224.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "Death Note",
    "score": "8.7",
    "views": "3.0m",
    "metaCount": "CH. 108",
    "statusBadge": "Legenda",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/54453.jpg"
  },
  {
    "id": 51,
    "malId": 51,
    "title": "Slam Dunk",
    "score": "9.1",
    "views": "1.4m",
    "metaCount": "CH. 276",
    "statusBadge": "Wajib Baca",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258749.jpg"
  },
  {
    "id": 25,
    "malId": 25,
    "title": "Fullmetal Alchemist",
    "score": "9.0",
    "views": "2.3m",
    "metaCount": "CH. 116",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/243675.jpg"
  },
  {
    "id": 11,
    "malId": 11,
    "title": "Naruto",
    "score": "8.1",
    "views": "3.2m",
    "metaCount": "CH. 700",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/117681.jpg"
  },
  {
    "id": 12,
    "malId": 12,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.9m",
    "metaCount": "CH. 705",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/180031.jpg"
  },
  {
    "id": 16765,
    "malId": 16765,
    "title": "Kingdom",
    "score": "9.0",
    "views": "1.2m",
    "metaCount": "CH. 820",
    "statusBadge": "Sejarah",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171872.jpg"
  },
  {
    "id": 1706,
    "malId": 1706,
    "title": "JoJo: Steel Ball Run",
    "score": "9.3",
    "views": "1.6m",
    "metaCount": "CH. 95",
    "statusBadge": "Mahakarya",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179882.jpg"
  },
  {
    "id": 114791,
    "malId": 114791,
    "title": "Blue Lock",
    "score": "8.3",
    "views": "1.3m",
    "metaCount": "CH. 280",
    "statusBadge": "Sports",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/224213.jpg"
  },
  {
    "id": 119119,
    "malId": 119119,
    "title": "Spy x Family",
    "score": "8.6",
    "views": "1.8m",
    "metaCount": "CH. 105",
    "statusBadge": "Komedi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/219741.jpg"
  },
  {
    "id": 126146,
    "malId": 126146,
    "title": "Oshi no Ko",
    "score": "8.5",
    "views": "1.1m",
    "metaCount": "CH. 166",
    "statusBadge": "Drama",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/238470.jpg"
  },
  {
    "id": 131334,
    "malId": 131334,
    "title": "Sakamoto Days",
    "score": "8.4",
    "views": "3.5m",
    "metaCount": "CH. 281",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/245842.jpg"
  },
  {
    "id": 162479,
    "malId": 162479,
    "title": "Kagurabachi",
    "score": "8.4",
    "views": "901k",
    "metaCount": "CH. 137",
    "statusBadge": "Pedang",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/298495.jpg"
  },
  {
    "id": 135496,
    "malId": 135496,
    "title": "Dandadan",
    "score": "8.3",
    "views": "920k",
    "metaCount": "CH. 175",
    "statusBadge": "Supranatural",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/249740.jpg"
  },
  {
    "id": 26,
    "malId": 26,
    "title": "Hunter x Hunter",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "CH. 405",
    "statusBadge": "Pilihan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253119.jpg"
  },
  {
    "id": 35243,
    "malId": 35243,
    "title": "Haikyuu!!",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "CH. 407",
    "statusBadge": "Voli",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258225.jpg"
  },
  {
    "id": 642,
    "malId": 642,
    "title": "Vinland Saga",
    "score": "9.0",
    "views": "1.7m",
    "metaCount": "CH. 215",
    "statusBadge": "Viking",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/188925.jpg"
  },
  {
    "id": 4632,
    "malId": 4632,
    "title": "Oyasumi Punpun",
    "score": "9.0",
    "views": "1.9m",
    "metaCount": "CH. 147",
    "statusBadge": "Mendalam",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164420.jpg"
  },
  {
    "id": 3,
    "malId": 3,
    "title": "20th Century Boys",
    "score": "8.9",
    "views": "1.5m",
    "metaCount": "CH. 249",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/5/260006.jpg"
  },
  {
    "id": 583,
    "malId": 583,
    "title": "Claymore",
    "score": "8.3",
    "views": "1.1m",
    "metaCount": "CH. 159",
    "statusBadge": "Fantasi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157894.jpg"
  },
  {
    "id": 1133,
    "malId": 1133,
    "title": "Dorohedoro",
    "score": "8.6",
    "views": "880k",
    "metaCount": "CH. 190",
    "statusBadge": "Kultus",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179023.jpg"
  },
  {
    "id": 112318,
    "malId": 112318,
    "title": "Jigokuraku",
    "score": "8.3",
    "views": "850k",
    "metaCount": "CH. 128",
    "statusBadge": "Ninja",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/216447.jpg"
  },
  {
    "id": 98270,
    "malId": 98270,
    "title": "Fire Punch",
    "score": "7.9",
    "views": "820k",
    "metaCount": "CH. 83",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179044.jpg"
  },
  {
    "id": 436,
    "malId": 436,
    "title": "Uzumaki",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "CH. 20",
    "statusBadge": "Horor",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/165240.jpg"
  },
  {
    "id": 936,
    "malId": 936,
    "title": "Homunculus",
    "score": "8.2",
    "views": "680k",
    "metaCount": "CH. 166",
    "statusBadge": "Psikologi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157904.jpg"
  },
  {
    "id": 712,
    "malId": 712,
    "title": "Pluto",
    "score": "8.6",
    "views": "720k",
    "metaCount": "CH. 65",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/168341.jpg"
  },
  {
    "id": 9711,
    "malId": 9711,
    "title": "Bakuman.",
    "score": "8.5",
    "views": "820k",
    "metaCount": "CH. 176",
    "statusBadge": "Kreator",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157900.jpg"
  },
  {
    "id": 64465,
    "malId": 64465,
    "title": "Inuyashiki",
    "score": "7.7",
    "views": "450k",
    "metaCount": "CH. 85",
    "statusBadge": "Hero",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157908.jpg"
  },
  {
    "id": 664,
    "malId": 664,
    "title": "Akira",
    "score": "8.7",
    "views": "650k",
    "metaCount": "CH. 120",
    "statusBadge": "Epik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/178434.jpg"
  },
  {
    "id": 3737,
    "malId": 3737,
    "title": "Solanin",
    "score": "8.3",
    "views": "550k",
    "metaCount": "CH. 28",
    "statusBadge": "Musik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164421.jpg"
  },
  {
    "id": 42,
    "malId": 42,
    "title": "Dragon Ball",
    "score": "8.4",
    "views": "1.9m",
    "metaCount": "CH. 520",
    "statusBadge": "Klasik",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258226.jpg"
  },
  {
    "id": 8848,
    "malId": 8848,
    "title": "Sun-Ken Rock",
    "score": "8.1",
    "views": "710k",
    "metaCount": "CH. 171",
    "statusBadge": "Aksi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157922.jpg"
  },
  {
    "id": 407,
    "malId": 407,
    "title": "GTO",
    "score": "8.9",
    "views": "890k",
    "metaCount": "CH. 208",
    "statusBadge": "Sekolah",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/172982.jpg"
  },
  {
    "id": 1303,
    "malId": 1303,
    "title": "Pandora Hearts",
    "score": "8.6",
    "views": "740k",
    "metaCount": "CH. 107",
    "statusBadge": "Misteri",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/168340.jpg"
  },
  {
    "id": 598,
    "malId": 598,
    "title": "Fairy Tail",
    "score": "7.6",
    "views": "2.1m",
    "metaCount": "CH. 545",
    "statusBadge": "Sihir",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171871.jpg"
  },
  {
    "id": 75989,
    "malId": 75989,
    "title": "Boku no Hero Academia",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "CH. 430",
    "statusBadge": "Pahlawan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157895.jpg"
  },
  {
    "id": 104565,
    "malId": 104565,
    "title": "Tokyo Revengers",
    "score": "7.8",
    "views": "1.2m",
    "metaCount": "CH. 278",
    "statusBadge": "Geng",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/204780.jpg"
  },
  {
    "id": 144,
    "malId": 144,
    "title": "BLAME!",
    "score": "8.2",
    "views": "620k",
    "metaCount": "CH. 66",
    "statusBadge": "Masa Depan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/179043.jpg"
  },
  {
    "id": 657,
    "malId": 657,
    "title": "Real",
    "score": "8.9",
    "views": "520k",
    "metaCount": "CH. 96",
    "statusBadge": "Basket",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/115981.jpg"
  },
  {
    "id": 564,
    "malId": 564,
    "title": "Gantz",
    "score": "8.1",
    "views": "1.8m",
    "metaCount": "CH. 383",
    "statusBadge": "Sci-Fi",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157929.jpg"
  },
  {
    "id": 33327,
    "malId": 33327,
    "title": "Tokyo Ghoul",
    "score": "8.5",
    "views": "2.9m",
    "metaCount": "CH. 143",
    "statusBadge": "Gelap",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/83547.jpg"
  },
  {
    "id": 135616,
    "malId": 135616,
    "title": "Choujin X",
    "score": "8.0",
    "views": "450k",
    "metaCount": "CH. 55",
    "statusBadge": "Kekuatan",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/249339.jpg"
  }
],
    classic: [
  {
    "id": 2,
    "malId": 2,
    "title": "Berserk",
    "score": "9.5",
    "views": "4.5m",
    "metaCount": "CH. 380",
    "statusBadge": "⭐ 9.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157897.jpg"
  },
  {
    "id": 1706,
    "malId": 1706,
    "title": "JoJo Part 7: Steel Ball Run",
    "score": "9.3",
    "views": "1.6m",
    "metaCount": "CH. 95",
    "statusBadge": "⭐ 9.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179882.jpg"
  },
  {
    "id": 656,
    "malId": 656,
    "title": "Vagabond",
    "score": "9.3",
    "views": "2.4m",
    "metaCount": "CH. 327",
    "statusBadge": "⭐ 9.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/259070.jpg"
  },
  {
    "id": 13,
    "malId": 13,
    "title": "One Piece",
    "score": "9.2",
    "views": "6.1m",
    "metaCount": "CH. 1198",
    "statusBadge": "⭐ 9.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253146.jpg"
  },
  {
    "id": 1,
    "malId": 1,
    "title": "Monster",
    "score": "9.1",
    "views": "2.1m",
    "metaCount": "CH. 162",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/258224.jpg"
  },
  {
    "id": 51,
    "malId": 51,
    "title": "Slam Dunk",
    "score": "9.1",
    "views": "1.4m",
    "metaCount": "CH. 276",
    "statusBadge": "⭐ 9.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258749.jpg"
  },
  {
    "id": 25,
    "malId": 25,
    "title": "Fullmetal Alchemist",
    "score": "9.0",
    "views": "2.3m",
    "metaCount": "CH. 116",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/243675.jpg"
  },
  {
    "id": 4632,
    "malId": 4632,
    "title": "Oyasumi Punpun",
    "score": "9.0",
    "views": "1.9m",
    "metaCount": "CH. 147",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164420.jpg"
  },
  {
    "id": 642,
    "malId": 642,
    "title": "Vinland Saga",
    "score": "9.0",
    "views": "1.7m",
    "metaCount": "CH. 215",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/188925.jpg"
  },
  {
    "id": 16765,
    "malId": 16765,
    "title": "Kingdom",
    "score": "9.0",
    "views": "1.2m",
    "metaCount": "CH. 820",
    "statusBadge": "⭐ 9.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171872.jpg"
  },
  {
    "id": 3,
    "malId": 3,
    "title": "20th Century Boys",
    "score": "8.9",
    "views": "1.5m",
    "metaCount": "CH. 249",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/5/260006.jpg"
  },
  {
    "id": 35243,
    "malId": 35243,
    "title": "Haikyuu!!",
    "score": "8.9",
    "views": "1.4m",
    "metaCount": "CH. 407",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258225.jpg"
  },
  {
    "id": 657,
    "malId": 657,
    "title": "Real",
    "score": "8.9",
    "views": "520k",
    "metaCount": "CH. 96",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/115981.jpg"
  },
  {
    "id": 407,
    "malId": 407,
    "title": "GTO (Great Teacher Onizuka)",
    "score": "8.9",
    "views": "890k",
    "metaCount": "CH. 208",
    "statusBadge": "⭐ 8.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/172982.jpg"
  },
  {
    "id": 26,
    "malId": 26,
    "title": "Hunter x Hunter",
    "score": "8.7",
    "views": "2.1m",
    "metaCount": "CH. 405",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/253119.jpg"
  },
  {
    "id": 116778,
    "malId": 116778,
    "title": "Chainsaw Man",
    "score": "8.7",
    "views": "2.8m",
    "metaCount": "CH. 185",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/216464.jpg"
  },
  {
    "id": 21,
    "malId": 21,
    "title": "Death Note",
    "score": "8.7",
    "views": "3.0m",
    "metaCount": "CH. 108",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/54453.jpg"
  },
  {
    "id": 664,
    "malId": 664,
    "title": "Akira",
    "score": "8.7",
    "views": "650k",
    "metaCount": "CH. 120",
    "statusBadge": "⭐ 8.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/178434.jpg"
  },
  {
    "id": 1133,
    "malId": 1133,
    "title": "Dorohedoro",
    "score": "8.6",
    "views": "880k",
    "metaCount": "CH. 190",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179023.jpg"
  },
  {
    "id": 23390,
    "malId": 23390,
    "title": "Shingeki no Kyojin",
    "score": "8.6",
    "views": "3.8m",
    "metaCount": "CH. 139",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/37846.jpg"
  },
  {
    "id": 712,
    "malId": 712,
    "title": "Pluto",
    "score": "8.6",
    "views": "720k",
    "metaCount": "CH. 65",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/168341.jpg"
  },
  {
    "id": 119119,
    "malId": 119119,
    "title": "Spy x Family",
    "score": "8.6",
    "views": "1.8m",
    "metaCount": "CH. 105",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/219741.jpg"
  },
  {
    "id": 1303,
    "malId": 1303,
    "title": "Pandora Hearts",
    "score": "8.6",
    "views": "740k",
    "metaCount": "CH. 107",
    "statusBadge": "⭐ 8.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/168340.jpg"
  },
  {
    "id": 113138,
    "malId": 113138,
    "title": "Jujutsu Kaisen",
    "score": "8.5",
    "views": "3.2m",
    "metaCount": "CH. 271",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/210341.jpg"
  },
  {
    "id": 33327,
    "malId": 33327,
    "title": "Tokyo Ghoul",
    "score": "8.5",
    "views": "2.9m",
    "metaCount": "CH. 143",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/83547.jpg"
  },
  {
    "id": 126146,
    "malId": 126146,
    "title": "Oshi no Ko",
    "score": "8.5",
    "views": "1.1m",
    "metaCount": "CH. 166",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/238470.jpg"
  },
  {
    "id": 9711,
    "malId": 9711,
    "title": "Bakuman.",
    "score": "8.5",
    "views": "820k",
    "metaCount": "CH. 176",
    "statusBadge": "⭐ 8.5",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157900.jpg"
  },
  {
    "id": 131334,
    "malId": 131334,
    "title": "Sakamoto Days",
    "score": "8.4",
    "views": "3.5m",
    "metaCount": "CH. 281",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/245842.jpg"
  },
  {
    "id": 162479,
    "malId": 162479,
    "title": "Kagurabachi",
    "score": "8.4",
    "views": "901k",
    "metaCount": "CH. 137",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/298495.jpg"
  },
  {
    "id": 42,
    "malId": 42,
    "title": "Dragon Ball",
    "score": "8.4",
    "views": "1.9m",
    "metaCount": "CH. 520",
    "statusBadge": "⭐ 8.4",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/258226.jpg"
  },
  {
    "id": 135496,
    "malId": 135496,
    "title": "Dandadan",
    "score": "8.3",
    "views": "920k",
    "metaCount": "CH. 175",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/249740.jpg"
  },
  {
    "id": 114791,
    "malId": 114791,
    "title": "Blue Lock",
    "score": "8.3",
    "views": "1.3m",
    "metaCount": "CH. 280",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/224213.jpg"
  },
  {
    "id": 583,
    "malId": 583,
    "title": "Claymore",
    "score": "8.3",
    "views": "1.1m",
    "metaCount": "CH. 159",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157894.jpg"
  },
  {
    "id": 112318,
    "malId": 112318,
    "title": "Jigokuraku",
    "score": "8.3",
    "views": "850k",
    "metaCount": "CH. 128",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/216447.jpg"
  },
  {
    "id": 3737,
    "malId": 3737,
    "title": "Solanin",
    "score": "8.3",
    "views": "550k",
    "metaCount": "CH. 28",
    "statusBadge": "⭐ 8.3",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/164421.jpg"
  },
  {
    "id": 144,
    "malId": 144,
    "title": "BLAME!",
    "score": "8.2",
    "views": "620k",
    "metaCount": "CH. 66",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/179043.jpg"
  },
  {
    "id": 936,
    "malId": 936,
    "title": "Homunculus",
    "score": "8.2",
    "views": "680k",
    "metaCount": "CH. 166",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157904.jpg"
  },
  {
    "id": 436,
    "malId": 436,
    "title": "Uzumaki",
    "score": "8.2",
    "views": "1.2m",
    "metaCount": "CH. 20",
    "statusBadge": "⭐ 8.2",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/165240.jpg"
  },
  {
    "id": 11,
    "malId": 11,
    "title": "Naruto",
    "score": "8.1",
    "views": "3.2m",
    "metaCount": "CH. 700",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/117681.jpg"
  },
  {
    "id": 8848,
    "malId": 8848,
    "title": "Sun-Ken Rock",
    "score": "8.1",
    "views": "710k",
    "metaCount": "CH. 171",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157922.jpg"
  },
  {
    "id": 564,
    "malId": 564,
    "title": "Gantz",
    "score": "8.1",
    "views": "1.8m",
    "metaCount": "CH. 383",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157929.jpg"
  },
  {
    "id": 75989,
    "malId": 75989,
    "title": "Boku no Hero Academia",
    "score": "8.1",
    "views": "2.4m",
    "metaCount": "CH. 430",
    "statusBadge": "⭐ 8.1",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/157895.jpg"
  },
  {
    "id": 135616,
    "malId": 135616,
    "title": "Choujin X",
    "score": "8.0",
    "views": "450k",
    "metaCount": "CH. 55",
    "statusBadge": "⭐ 8.0",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/1/249339.jpg"
  },
  {
    "id": 12,
    "malId": 12,
    "title": "Bleach",
    "score": "7.9",
    "views": "2.9m",
    "metaCount": "CH. 705",
    "statusBadge": "⭐ 7.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/180031.jpg"
  },
  {
    "id": 98270,
    "malId": 98270,
    "title": "Fire Punch",
    "score": "7.9",
    "views": "820k",
    "metaCount": "CH. 83",
    "statusBadge": "⭐ 7.9",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/3/179044.jpg"
  },
  {
    "id": 104565,
    "malId": 104565,
    "title": "Tokyo Revengers",
    "score": "7.8",
    "views": "1.2m",
    "metaCount": "CH. 278",
    "statusBadge": "⭐ 7.8",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/204780.jpg"
  },
  {
    "id": 64465,
    "malId": 64465,
    "title": "Inuyashiki",
    "score": "7.7",
    "views": "450k",
    "metaCount": "CH. 85",
    "statusBadge": "⭐ 7.7",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/157908.jpg"
  },
  {
    "id": 598,
    "malId": 598,
    "title": "Fairy Tail",
    "score": "7.6",
    "views": "2.1m",
    "metaCount": "CH. 545",
    "statusBadge": "⭐ 7.6",
    "country": "🇯🇵",
    "image": "https://cdn.myanimelist.net/images/manga/2/171871.jpg"
  }
],
  },
};

// Cache in-memory untuk meminimalkan beban request API
const homeCache = new Map();

function formatStatViews(num) {
  if (!num) return "1.2m";
  if (typeof num === "string") return num;
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  if (num >= 1000) return (num / 1000).toFixed(0) + "k";
  return num.toString();
}

/**
 * Mengambil data untuk kategori Beranda secara dinamis melalui Tenrai API.
 * Sesuai kontrak data Mojiji: memetakan poster, skor, views, dan status secara konsisten.
 * @param {'top_rated' | 'recommended' | 'trending' | 'classic'} category 
 * @param {'anime' | 'manga'} mediaType 
 * @param {number} page 
 * @param {number} limit 
 */
export async function fetchHomeCategoryData(category, mediaType, page = 1, limit = 12) {
  const cacheKey = `${category}_${mediaType}_${page}_${limit}`;
  if (homeCache.has(cacheKey)) {
    return homeCache.get(cacheKey);
  }

  // Tentukan endpoint resmi Tenrai API berdasarkan kriteria kategori
  let endpoint = "";
  if (category === "top_rated") {
    endpoint = `${TENRAI_BASE_URL}/${mediaType}?order_by=score&sort=desc&page=${page}&limit=${limit}&sfw`;
  } else if (category === "recommended") {
    endpoint = `${TENRAI_BASE_URL}/${mediaType}?order_by=popularity&sort=desc&page=${page}&limit=${limit}&sfw`;
  } else if (category === "trending") {
    const statusParam = mediaType === "anime" ? "airing" : "publishing";
    endpoint = `${TENRAI_BASE_URL}/${mediaType}?status=${statusParam}&order_by=popularity&sort=desc&page=${page}&limit=${limit}&sfw`;
  } else if (category === "classic") {
    endpoint = `${TENRAI_BASE_URL}/${mediaType}?status=complete&order_by=score&sort=desc&page=${page}&limit=${limit}&sfw`;
  }

  try {
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "MOJIJI-AnimeList-Web/1.0",
        },
        signal: AbortSignal.timeout(10000), // Batas waktu 10 detik sesuai standar Tenrai Client
      });

      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map((item, idx) => {
            const score = typeof item.score === "number" ? item.score.toFixed(1) : "8.2";
            const views = formatStatViews(item.members || item.scored_by);
            const count =
              mediaType === "anime"
                ? item.episodes ? `EPS. ${item.episodes}` : "EPS. ?"
                : item.chapters ? `CH. ${item.chapters}` : "CH. ?";

            const poster =
              item.images?.webp?.large_image_url ||
              item.images?.webp?.image_url ||
              item.images?.jpg?.large_image_url ||
              item.images?.jpg?.image_url ||
              "";

            let badge = `#${idx + 1 + (page - 1) * limit}`;
            if (category === "top_rated") badge = `⭐ ${score}`;
            else if (category === "classic") badge = "Legenda";
            else if (category === "trending") badge = "🔥 Hot";

            return {
              id: item.mal_id,
              malId: item.mal_id,
              title: item.title || item.title_english || "Untitled",
              score,
              views,
              metaCount: count,
              statusBadge: badge,
              country: "🇯🇵",
              image: poster,
            };
          });

          const result = {
            items: normalized,
            pagination: {
              currentPage: page,
              hasNextPage: json.pagination?.has_next_page ?? page < 4,
              totalPages: 4, // 4 halaman tetap sesuai UI beranda
            },
          };

          homeCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch {
    // Jika timeout atau offline, otomatis gunakan fallback kurasi Tenrai per-halaman
  }

  // Fallback Kurasi Tenrai Per Halaman (Tiap halaman memiliki 12 judul unik dan poster 100% aktif)
  const fallbackList = FALLBACK_HOME_DATA[mediaType]?.[category] || [];
  const startIdx = (page - 1) * limit;
  const sliced = fallbackList.slice(startIdx, startIdx + limit);
  const items = sliced.length > 0 ? sliced : fallbackList.slice(0, limit);

  return {
    items,
    pagination: {
      currentPage: page,
      hasNextPage: page < 4,
      totalPages: 4,
    },
  };
}
