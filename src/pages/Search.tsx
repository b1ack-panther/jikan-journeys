import { useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Pagination } from '@/components/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchAnime } from '@/store/animeSlice';
import heroImage from '@/assets/anime-hero.jpg';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const dispatch = useAppDispatch();
  const { searchResults, loading, currentPage, totalPages, searchQuery } = useAppSelector(
    (state) => state.anime
  );

  const handlePageChange = (page: number) => {
    if (searchQuery) {
      dispatch(searchAnime({ query: searchQuery, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        {loading ? (
          <LoadingSkeleton />
        ) : searchResults.length > 0 ? (
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
              {searchResults.map((anime) => (
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
