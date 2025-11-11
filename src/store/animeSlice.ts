import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jikanApi } from '@/services/jikanApi';
import { Anime, AnimeCharacter, SearchFilters } from '@/types/anime';

// Local storage helpers
const FAVORITES_KEY = 'anime_favorites';

const loadFavoritesFromStorage = (): number[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites: number[]) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  characters: AnimeCharacter[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  favorites: number[];
  filters: SearchFilters;
}

const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  characters: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  favorites: loadFavoritesFromStorage(),
  filters: {},
};

export const searchAnime = createAsyncThunk(
  'anime/search',
  async ({ query, page, filters }: { query: string; page: number; filters?: SearchFilters }, { signal }) => {
    const response = await jikanApi.searchAnime(query, page, filters);
    
    // Check if the request was cancelled
    if (signal.aborted) {
      throw new Error('Request cancelled');
    }
    
    return response;
  }
);

export const fetchAnimeById = createAsyncThunk(
  'anime/fetchById',
  async (id: number) => {
    const response = await jikanApi.getAnimeById(id);
    return response.data;
  }
);

export const fetchAnimeCharacters = createAsyncThunk(
  'anime/fetchCharacters',
  async (id: number) => {
    const response = await jikanApi.getAnimeCharacters(id);
    return response.data;
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
      state.characters = [];
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const animeId = action.payload;
      const index = state.favorites.indexOf(animeId);
      
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(animeId);
      }
      
      saveFavoritesToStorage(state.favorites);
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search anime
      .addCase(searchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
        state.currentPage = action.payload.pagination.current_page;
        state.totalPages = action.payload.pagination.last_visible_page;
      })
      .addCase(searchAnime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search anime';
      })
      // Fetch anime by ID
      .addCase(fetchAnimeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch anime details';
      })
      // Fetch characters
      .addCase(fetchAnimeCharacters.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAnimeCharacters.fulfilled, (state, action) => {
        state.characters = action.payload;
      })
      .addCase(fetchAnimeCharacters.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch characters';
      });
  },
});

export const { setSearchQuery, clearSelectedAnime, toggleFavorite, setFilters } = animeSlice.actions;
export default animeSlice.reducer;
