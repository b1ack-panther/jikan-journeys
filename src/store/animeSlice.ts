import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jikanApi } from '@/services/jikanApi';
import { Anime, AnimeCharacter } from '@/types/anime';

interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  characters: AnimeCharacter[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
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
};

export const searchAnime = createAsyncThunk(
  'anime/search',
  async ({ query, page }: { query: string; page: number }, { signal }) => {
    const response = await jikanApi.searchAnime(query, page);
    
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

export const { setSearchQuery, clearSelectedAnime } = animeSlice.actions;
export default animeSlice.reducer;
