export default function MangaDetailPage({ params }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-foreground">
        Detail Manga
      </h1>
      <p className="text-sm text-muted-foreground">
        MAL ID: {params.malId}
      </p>
    </div>
  );
}
