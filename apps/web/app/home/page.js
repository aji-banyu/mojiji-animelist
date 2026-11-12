"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import AuthGuard from "@/components/AuthGuard";
import HeroBanner from "@/components/home/HeroBanner";
import HomeSectionSlider from "@/components/home/HomeSectionSlider";
import { fetchHomeCategoryData } from "@/lib/homeData";
import useFilterStore from "@/store/filterStore";
import useTrackerStore from "@/store/trackerStore";

const GENRE_MAP = {
  Action: "Aksi",
  Adventure: "Petualangan",
  Drama: "Drama",
  Fantasy: "Fantasi",
  "Sci-Fi": "Sci-Fi",
  Suspense: "Ketegangan",
  Supernatural: "Supranatural",
  Comedy: "Komedi",
  Mystery: "Misteri",
  Romance: "Romantis",
  Slice_of_Life: "Keseharian",
};

function translateGenres(genres = []) {
  if (!genres || genres.length === 0) return ["Aksi", "Petualangan"];
  return genres.slice(0, 2).map((g) => GENRE_MAP[g] || g);
}

// 6 Anime Populer Terbaik Dunia (Cadangan instan dengan backdrop trailer HD 1080p)
const FAMOUS_POPULAR_HERO = [
  {
    id: 16498,
    type: "anime",
    title: "Shingeki no Kyojin",
    score: 8.6,
    genres: ["Aksi", "Drama"],
    synopsis:
      "Umat manusia bertahan di balik tembok raksasa demi membendung ancaman para titan yang memusnahkan peradaban.",
    year: "2013",
    metaCount: "25 eps",
    image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    bannerImage: "https://img.youtube.com/vi/LHtdKWJdif4/maxresdefault.jpg",
  },
  {
    id: 1535,
    type: "anime",
    title: "Death Note",
    score: 8.6,
    genres: ["Ketegangan", "Supranatural"],
    synopsis:
      "Light Yagami menemukan buku catatan kematian dan memulai misi pembersihan dunia dari para penjahat di balik identitas Kira.",
    year: "2006",
    metaCount: "37 eps",
    image: "https://cdn.myanimelist.net/images/anime/1079/138100.jpg",
    bannerImage: "https://img.youtube.com/vi/Vt_3c8BgxV4/maxresdefault.jpg",
  },
  {
    id: 5114,
    type: "anime",
    title: "Fullmetal Alchemist: Brotherhood",
    score: 9.1,
    genres: ["Aksi", "Petualangan"],
    synopsis:
      "Dua bersaudara Elric mencari batu bertuah demi mengembalikan tubuh mereka setelah kegagalan transmutasi manusia.",
    year: "2009",
    metaCount: "64 eps",
    image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    bannerImage: "https://img.youtube.com/vi/1ac3_YdSSy0/maxresdefault.jpg",
  },
  {
    id: 30276,
    type: "anime",
    title: "One Punch Man",
    score: 8.5,
    genres: ["Aksi", "Komedi"],
    synopsis:
      "Saitama menjadi pahlawan super terkuat yang mampu mengalahkan musuh mana pun hanya dengan sekali pukul.",
    year: "2015",
    metaCount: "12 eps",
    image: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
    bannerImage: "https://img.youtube.com/vi/ExUMiF1L0HA/maxresdefault.jpg",
  },
  {
    id: 38000,
    type: "anime",
    title: "Kimetsu no Yaiba",
    score: 8.5,
    genres: ["Aksi", "Historis"],
    synopsis:
      "Tanjiro Kamado bergabung dengan Korps Pembasmi Iblis untuk menyelamatkan adiknya yang berubah menjadi iblis.",
    year: "2019",
    metaCount: "26 eps",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    bannerImage: "https://img.youtube.com/vi/6vMuWuWlW4I/maxresdefault.jpg",
  },
  {
    id: 31964,
    type: "anime",
    title: "Boku no Hero Academia",
    score: 8.1,
    genres: ["Aksi", "Petualangan"],
    synopsis:
      "Izuku Midoriya berjuang menjadi pahlawan nomor satu di dunia di mana hampir semua orang memiliki kekuatan khusus.",
    year: "2016",
    metaCount: "13 eps",
    image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    bannerImage: "https://img.youtube.com/vi/D5fYOnwYkj4/maxresdefault.jpg",
  },
];

const EMPTY_SECTION_DATA = { anime: [], manga: [] };
const HOME_CACHE_TTL_MS = 5 * 60 * 1000;

const HOME_SECTION_CONFIGS = [
  {
    catalogKey: "latestData",
    loadingKey: "latest",
    category: "latest",
    animeLimit: 15,
    mangaLimit: 15,
  },
  {
    catalogKey: "topRatedData",
    loadingKey: "topRated",
    category: "top_rated",
    animeLimit: 15,
    mangaLimit: 15,
  },
  {
    catalogKey: "trendingData",
    loadingKey: "trending",
    category: "trending",
    animeLimit: 25,
    mangaLimit: 15,
  },
  {
    catalogKey: "popularData",
    loadingKey: "popular",
    category: "popular",
    animeLimit: 20,
    mangaLimit: 15,
    includeHero: true,
  },
];

function hasFreshHomeCatalog(catalog) {
  return (
    Boolean(catalog?.fetchedAt) &&
    catalog?.isComplete !== false &&
    Date.now() - catalog.fetchedAt < HOME_CACHE_TTL_MS
  );
}

function mapHomeItems(items = [], defaultType = "anime") {
  return items
    .filter((it) => it.title && it.title !== "Untitled")
    .map((item) => ({
      id: item.id || item.malId,
      type: item.type || defaultType,
      typeLabel: defaultType === "anime" ? "TV" : "Manga",
      title: item.title,
      score:
        typeof item.score === "number"
          ? item.score
          : parseFloat(item.score) || 8.5,
      metaCount: item.metaCount || (defaultType === "anime" ? "24 Eps" : "Manga"),
      episodes: item.metaCount || (defaultType === "anime" ? "24 Eps" : "Manga"),
      views: item.views || "1.2m",
      year: item.year || "2024",
      image: item.image,
      bannerImage: item.bannerImage || item.image,
      genres: translateGenres(item.genres),
      synopsis: item.synopsis || "",
    }));
}

function buildHeroItems(popularAnime = []) {
  const validPopularAnime = popularAnime.filter((it) => {
    const t = it.title.toLowerCase();
    return (
      !t.includes("pv") &&
      !t.includes("music") &&
      !t.includes("commercial") &&
      !t.includes("teaser") &&
      !t.includes("special") &&
      (it.bannerImage || it.image)
    );
  });

  const heroPool =
    validPopularAnime.length >= 6
      ? validPopularAnime
      : [...validPopularAnime, ...FAMOUS_POPULAR_HERO];

  return Array.from(new Map(heroPool.map((it) => [it.id, it])).values()).slice(
    0,
    6
  );
}

function getFilteredList(dataSet, activeTab, isSectionLoading = false) {
  if (activeTab === "anime") {
    if (dataSet.anime.length > 0) return dataSet.anime;
    return isSectionLoading ? [] : FAMOUS_POPULAR_HERO;
  }
  if (activeTab === "manga") return dataSet.manga;

  const combined = [];
  const maxLen = Math.max(dataSet.anime.length, dataSet.manga.length);
  for (let i = 0; i < maxLen; i++) {
    if (dataSet.anime[i]) combined.push(dataSet.anime[i]);
    if (dataSet.manga[i]) combined.push(dataSet.manga[i]);
  }
  if (combined.length > 0) return combined;
  return isSectionLoading ? [] : FAMOUS_POPULAR_HERO;
}

export default function HomePage() {
  const homeTabs = useFilterStore((state) => state.homeTabs);
  const hydrateHomeTabs = useFilterStore((state) => state.hydrateHomeTabs);
  const setHomeTab = useFilterStore((state) => state.setHomeTab);
  const homeCatalog = useFilterStore((state) => state.homeCatalog);
  const setHomeCatalog = useFilterStore((state) => state.setHomeCatalog);
  const setHomeHeroIndex = useFilterStore((state) => state.setHomeHeroIndex);

  const latestTab = homeTabs.latest;
  const topRatedTab = homeTabs.topRated;
  const trendingTab = homeTabs.trending;
  const popularTab = homeTabs.popular;

  const heroItems = homeCatalog?.heroItems || FAMOUS_POPULAR_HERO;
  const latestData = homeCatalog?.latestData || EMPTY_SECTION_DATA;
  const topRatedData = homeCatalog?.topRatedData || EMPTY_SECTION_DATA;
  const trendingData = homeCatalog?.trendingData || EMPTY_SECTION_DATA;
  const popularData = homeCatalog?.popularData || EMPTY_SECTION_DATA;

  const [loadingSections, setLoadingSections] = useState(() => {
    const isFresh = hasFreshHomeCatalog(useFilterStore.getState().homeCatalog);
    return {
      latest: !isFresh,
      topRated: !isFresh,
      trending: !isFresh,
      popular: !isFresh,
    };
  });

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Muat preferensi tab & sinkronkan koleksi tracker user untuk status "+ Tracker / Di Tracker"
  useEffect(() => {
    hydrateHomeTabs();
    useTrackerStore.getState().fetchTrackerList().catch(() => {});
  }, [hydrateHomeTabs]);

  // Muat data live anime & manga dari API backend (Tenrai) secara progresif dengan pembatalan & cache sesi
  useEffect(() => {
    let isMounted = true;
    const cached = useFilterStore.getState().homeCatalog;
    if (hasFreshHomeCatalog(cached)) {
      return;
    }

    const controller = new AbortController();

    async function loadSectionPair({
      catalogKey,
      loadingKey,
      category,
      animeLimit,
      mangaLimit,
      includeHero = false,
    }) {
      const [animeRes, mangaRes] = await Promise.allSettled([
        fetchHomeCategoryData(category, "anime", 1, animeLimit, {
          signal: controller.signal,
        }),
        fetchHomeCategoryData(category, "manga", 1, mangaLimit, {
          signal: controller.signal,
        }),
      ]);

      if (!isMounted || controller.signal.aborted) return;

      const animeItems =
        animeRes.status === "fulfilled"
          ? mapHomeItems(animeRes.value?.items, "anime")
          : null;
      const mangaItems =
        mangaRes.status === "fulfilled"
          ? mapHomeItems(mangaRes.value?.items, "manga")
          : null;

      setHomeCatalog((prev) => {
        const base = prev || {
          heroItems: FAMOUS_POPULAR_HERO,
          latestData: EMPTY_SECTION_DATA,
          topRatedData: EMPTY_SECTION_DATA,
          trendingData: EMPTY_SECTION_DATA,
          popularData: EMPTY_SECTION_DATA,
        };
        const prevSection = base[catalogKey] || EMPTY_SECTION_DATA;
        const nextSection = {
          anime: animeItems !== null ? animeItems : prevSection.anime,
          manga: mangaItems !== null ? mangaItems : prevSection.manga,
        };
        const nextHeroItems =
          includeHero && nextSection.anime.length > 0
            ? buildHeroItems(nextSection.anime)
            : base.heroItems;

        return {
          ...base,
          heroItems: nextHeroItems,
          [catalogKey]: nextSection,
          isComplete: false,
        };
      });

      setLoadingSections((prev) => ({ ...prev, [loadingKey]: false }));
    }

    async function loadBackendData() {
      try {
        await Promise.allSettled(HOME_SECTION_CONFIGS.map(loadSectionPair));

        if (!isMounted || controller.signal.aborted) return;

        setHomeCatalog((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isComplete: true,
          };
        });
        if (!cached) {
          setHomeHeroIndex(0);
        }
      } catch (err) {
        if (err?.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Gagal sinkronisasi katalog:", err);
        }
      }
    }

    loadBackendData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [setHomeCatalog, setHomeHeroIndex]);

  const latestList = useMemo(
    () => getFilteredList(latestData, latestTab, loadingSections.latest),
    [latestData, latestTab, loadingSections.latest]
  );
  const topRatedList = useMemo(
    () => getFilteredList(topRatedData, topRatedTab, loadingSections.topRated),
    [topRatedData, topRatedTab, loadingSections.topRated]
  );
  const trendingList = useMemo(
    () => getFilteredList(trendingData, trendingTab, loadingSections.trending),
    [trendingData, trendingTab, loadingSections.trending]
  );
  const popularList = useMemo(
    () => getFilteredList(popularData, popularTab, loadingSections.popular),
    [popularData, popularTab, loadingSections.popular]
  );

  const toastDotClass =
    toast?.type === "error"
      ? "bg-destructive"
      : toast?.type === "info"
      ? "bg-accent"
      : "bg-status-active";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg text-text pb-24 selection:bg-accent/30 selection:text-text">
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-border/60 bg-surface px-4 py-3 text-xs font-semibold text-text shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <span className={`flex h-2 w-2 rounded-full ${toastDotClass}`} />
            <span>{toast.message}</span>
          </div>
        )}

        <HeroBanner heroItems={heroItems} onNotify={showToast} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
          <HomeSectionSlider
            title="Baru Diperbarui"
            currentTab={latestTab}
            onTabChange={(tab) => setHomeTab("latest", tab)}
            items={latestList}
            isLoading={loadingSections.latest}
          />
          <HomeSectionSlider
            title="Top Rated"
            currentTab={topRatedTab}
            onTabChange={(tab) => setHomeTab("topRated", tab)}
            items={topRatedList}
            isLoading={loadingSections.topRated}
          />
          <HomeSectionSlider
            title="Sedang Tren"
            currentTab={trendingTab}
            onTabChange={(tab) => setHomeTab("trending", tab)}
            items={trendingList}
            isLoading={loadingSections.trending}
          />
          <HomeSectionSlider
            title="Paling Populer"
            currentTab={popularTab}
            onTabChange={(tab) => setHomeTab("popular", tab)}
            items={popularList}
            isLoading={loadingSections.popular}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
