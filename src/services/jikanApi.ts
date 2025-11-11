import { SearchResponse, AnimeDetailResponse, CharactersResponse } from '@/types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export const jikanApi = {
  searchAnime: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await fetch(
      `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`
    );
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
