import { useMemo, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { FilterBar } from '@/components/FilterBar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Pagination } from '@/components/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchAnime, setFilters } from '@/store/animeSlice';
import { SearchFilters } from '@/types/anime';
import heroImage from '@/assets/anime-hero.jpg';
import { Search as SearchIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Search = () => {
  const dispatch = useAppDispatch();
  const { searchResults, loading, currentPage, totalPages, searchQuery, filters, favorites } = useAppSelector(
    (state) => state.anime
  );

  const handlePageChange = useCallback((page: number) => {
    if (searchQuery) {
      dispatch(searchAnime({ query: searchQuery, page, filters }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchQuery, filters, dispatch]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    dispatch(setFilters(newFilters));
    if (searchQuery) {
      dispatch(searchAnime({ query: searchQuery, page: 1, filters: newFilters }));
    }
  }, [searchQuery, dispatch]);

  // Memoize filtered results to show favorites
  const displayResults = useMemo(() => {
    return searchResults;
  }, [searchResults]);

  const favoriteCount = useMemo(() => favorites.length, [favorites.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Discover Anime
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search thousands of anime titles
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        {searchQuery && <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />}
        
        {favoriteCount > 0 && (
          <div className="mb-6 flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">
              {favoriteCount} {favoriteCount === 1 ? 'favorite' : 'favorites'} saved
            </span>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : displayResults.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Search Results {searchQuery && `for "${searchQuery}"`}
              </h2>
              <p className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayResults.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try searching with a different term
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Start Your Search</h3>
            <p className="text-muted-foreground">
              Enter an anime title above to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
