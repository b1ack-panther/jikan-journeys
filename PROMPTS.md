# AI Prompts Documentation

This file documents the prompts used with AI assistance and the parts of the project they helped with.

## Prompt 1: Initial Project Analysis
**Prompt**
```
help me implement this assignment. ask any questions for decision making if required
[Included full project specification]
```
**Helped With**
- Clarified theme, UI library, layout, detail page scope, port, and state management.

## Prompt 2: Design & Implementation Direction
**Prompt**
```
Modern dark theme with vibrant gradients
use shadcn but make it non detectable
card view
detail page contains all available details
use redux
include your suggested improvements
```
**Helped With**
- Theme setup, shadcn customization, Redux Toolkit slice, Jikan API service, search debouncing and aborting, core pages and components.

## Prompt 3: Feature Enhancements
**Prompt**
```
Implement favorites with local storage
Add genre and rating filters
Optimize performance with React.memo and useMemo
```
**Helped With**
- Favorites toggle, filters on search page, render optimizations.

## Prompt 4: Top Anime on Search Page
**Prompt**
```
implement a component topanime and render it on search page instead of start your search icon; show top anime and if user searches for something, show search result.
endpoint - /top/anime?limit=&page=
```
**Helped With**
- Added `getTopAnime` API, built `TopAnime` component with pagination, integrated into empty state of the Search page.

## Prompt 5: Persist Search Query Across Navigation
**Prompt**
```
When navigating back from an anime detail page to the search list, the search query is lost and the results disappear. How can I persist the search query and displayed results when returning to the search page?
```
**Helped With**
- Synced search input with URL `search` param; restored query on back/forward.

## Prompt 6: Avoid Unnecessary Refetch on Back
**Prompt**
```
After returning to the search list from a detail page, the list reloads/refreshes even if the search query hasn't changed. How can I prevent this redundant fetching behavior to improve performance and user experience?
```
**Helped With**
- Guarded SearchBar to skip dispatch if query unchanged and results exist.

