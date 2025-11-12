import { useEffect, useState, useCallback } from "react";
import { jikanApi } from "@/services/jikanApi";
import { Anime } from "@/types/anime";
import { AnimeCard } from "@/components/AnimeCard";
import { Pagination } from "@/components/Pagination";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export const TopAnime = () => {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchTop = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jikanApi.getTopAnime(limit, p);
      setItems(res.data);
      setTotalPages(res.pagination.last_visible_page);
    } catch {
      setError("Failed to load top anime");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop(page);
  }, [page, fetchTop]);

  const handlePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center py-20 text-destructive">{error}</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Top Anime</h2>
        <p className="text-muted-foreground">Page {page} of {totalPages}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePage} />
      )}
    </div>
  );
};

