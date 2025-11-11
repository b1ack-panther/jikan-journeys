import { SearchResponse, AnimeDetailResponse, CharactersResponse, SearchFilters } from '@/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export const jikanApi = {
  searchAnime: async (query: string, page: number = 1, filters?: SearchFilters): Promise<SearchResponse> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: '20',
    });

    if (filters?.genres && filters.genres.length > 0) {
      params.append('genres', filters.genres.join(','));
    }
    if (filters?.minScore) {
      params.append('min_score', filters.minScore.toString());
    }
    if (filters?.maxScore) {
      params.append('max_score', filters.maxScore.toString());
    }
    if (filters?.rating) {
      params.append('rating', filters.rating);
    }

    const response = await fetch(`${BASE_URL}/anime?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch anime');
    }
    return response.json();
  },

  getAnimeById: async (id: number): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch anime details');
    }
    return response.json();
  },

  getAnimeCharacters: async (id: number): Promise<CharactersResponse> => {
    const response = await fetch(`${BASE_URL}/anime/${id}/characters`);
    if (!response.ok) {
      throw new Error('Failed to fetch anime characters');
    }
    return response.json();
  },
};
