# AI Prompts Documentation

This document tracks all AI prompts used during the development of the Anime Search App project.

---

## Prompt 1: Initial Project Analysis & Clarifying Questions

**Prompt:**

```
help me implement this assignment. ask any questions for decision making if required

[Included full project specification from YoPrint React Coding Project Spec]
```

**Context:** Initial project setup and requirements gathering

**AI Response:** The AI analyzed the requirements and asked clarifying questions about:

- Visual style preferences (dark/light theme)
- UI library choice
- Layout preferences for search results
- Detail page information priority
- Port configuration acceptance
- Redux vs Redux Toolkit preference

**What This Helped With:**

- Understanding project requirements
- Identifying areas needing design decisions
- Preventing assumptions that could lead to rework

---

## Prompt 2: Design Decisions & Final Implementation

**Prompt:**

```
Modern dark theme with vibrant...
use shadcn but make it non detectable.
card view
detail page - this page should contain all the available details - synopsis, ratings, episodes, genres, characters, with banner and images
for port changes configs
use redux
include these things too that you thought
Dark theme with vibrant gradients (anime tends to be colorful)
Card grid layout for search results with hover effects
Smooth animations for page transitions
Generated hero image of anime-style artwork
```

**Context:** Final specifications and implementation directive

**What This Helped With:**

### 1. Design System Setup

- Created custom dark theme with vibrant gradients in `src/index.css`
- Customized shadcn components to blend seamlessly with the theme
- Used HSL color system with primary (purple), secondary (pink), and accent (cyan) colors
- Added custom gradients and glow effects for anime aesthetic

### 2. State Management Architecture

- Set up Redux Toolkit with proper TypeScript typing
- Created `animeSlice.ts` with async thunks for API calls
- Implemented proper loading states and error handling
- Added pagination state management

### 3. API Integration

- Built `jikanApi.ts` service layer for Jikan API
- Implemented proper TypeScript interfaces in `src/types/anime.ts`
- Added comprehensive type safety for all API responses

### 4. Search Functionality

- Created `SearchBar.tsx` with 250ms debouncing
- Implemented AbortController for canceling in-flight requests
- Added instant search without requiring Enter key
- Integrated with Redux for state management

### 5. UI Components

- `AnimeCard.tsx`: Responsive card with hover effects and gradient overlays
- `Pagination.tsx`: Server-side pagination component
- `LoadingSkeleton.tsx`: Loading states using shadcn Skeleton
- All components using semantic tokens from design system

### 6. Pages

- `Search.tsx`: Hero section with generated anime artwork, search bar, results grid, pagination
- `AnimeDetail.tsx`: Comprehensive detail page with banner, synopsis, characters, genres, ratings, episodes, studios, and all available information
- Proper error handling and empty states

### 7. Configuration

- Modified `vite.config.ts` to use port 4000 (as specified in requirements)
- Set up React Router with proper routes
- Integrated Redux Provider in App.tsx

### 8. Visual Assets

- Generated hero image using AI (`anime-hero.jpg`)
- Implemented gradient backgrounds and glow effects
- Added smooth transitions and hover animations

---

## Prompt 3: Feature Enhancements (Implemented)

**Prompt:**

```
Implement these features:
3. Favorites Feature: Implement local storage favorites system with toggle button on cards
4. Advanced Filtering: Add genre and rating filters to the search page
5. Performance: Add React.memo and useMemo optimizations for better performance
```

**What This Helped With:**

- Implemented favorites using `localStorage` with a toggle on `AnimeCard` items
- Added advanced filters (genre, rating) to `Search` page with Redux integration
- Optimized renders with `React.memo` and `useMemo` for lists and derived data

---

## Technical Decisions Made

### Why Redux Toolkit?

- Modern Redux approach with less boilerplate
- Built-in TypeScript support
- createAsyncThunk simplifies async logic
- Better developer experience

### Why This Component Structure?

- Separation of concerns (services, components, pages, store)
- Reusable components (AnimeCard, Pagination, LoadingSkeleton)
- Easy to extend and maintain
- Follows React best practices

### Why This Styling Approach?

- Semantic tokens for consistency
- HSL colors for better theme control
- Custom gradients for unique "wow" factor
- Mobile-responsive by default

### API Request Handling Strategy

- Debouncing prevents excessive API calls
- AbortController prevents race conditions
- Proper error handling for network failures
- Loading states for better UX

---

## Requirements Coverage

✅ React 18 with hooks only  
✅ TypeScript with proper typing  
✅ react-router-dom for navigation  
✅ Redux for state management  
✅ shadcn/ui components (customized)  
✅ Server-side pagination  
✅ Instant search with 250ms debouncing  
✅ npm only setup  
✅ Port 4000 configuration  
✅ No environment variables needed

### Bonus Features Implemented

✅ Modern dark theme with vibrant gradients  
✅ Skeleton loaders  
✅ Empty state handling  
✅ Mobile responsiveness  
✅ Race condition handling (AbortController)  
✅ Custom hero image generation  
✅ Smooth animations and transitions  
✅ Comprehensive detail page with all available data  
✅ Favorites with localStorage and card toggle  
✅ Advanced filters: genre and rating on search page  
✅ Performance optimizations with React.memo and useMemo

---

## Future Enhancement Prompts (Not Yet Implemented)

These prompts could be used for further improvements:

1. **Error Handling UI**: "Add toast notifications for API errors and rate limiting messages"
2. **Testing**: "Add unit tests for Redux slices and integration tests for search functionality"

---

## Lessons Learned

1. **Clear specifications save time**: Asking clarifying questions upfront prevented multiple iterations
2. **Design system first**: Setting up the theme tokens early made component styling consistent
3. **Type safety matters**: Comprehensive TypeScript interfaces caught potential bugs early
4. **User experience details**: Debouncing, loading states, and error handling make the app feel professional

<!-- implement a component topanime and render it on search page instead of start your search icon show top anime and if user searches for something, show search result.

endpoint - /top/anime?limit=&page= -->