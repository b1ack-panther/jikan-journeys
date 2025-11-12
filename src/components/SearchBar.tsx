import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAnime, setSearchQuery } from "@/store/animeSlice";
import FavoritesSidebar from "./FavoriteBar";
import { useSearchParams } from "react-router-dom";

const DEBOUNCE_DELAY = 250;

export const SearchBar = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [localQuery, setLocalQuery] = useState(
		searchParams.get("search") ?? ""
	);
	const dispatch = useAppDispatch();
	const filters = useAppSelector((state) => state.anime.filters);
	const abortControllerRef = useRef<AbortController | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const performSearch = useCallback(
		(query: string) => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();

			dispatch(
				searchAnime({
					query,
					page: 1,
					filters,
				})
			);
		},
		[dispatch, filters]
	);

	useEffect(() => {
		// Cancel any pending requests
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Clear existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		dispatch(setSearchQuery(localQuery.trim()));
		// Only search if query is not empty
		if (localQuery.trim()) {
			timeoutRef.current = setTimeout(() => {
				performSearch(localQuery);
			}, DEBOUNCE_DELAY);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [localQuery, performSearch, dispatch]);

	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		if (localQuery.trim()) {
			params.set("search", localQuery.trim());
		} else {
			params.delete("search");
		}
		setSearchParams(params, { replace: true });
	}, [localQuery, setSearchParams, searchParams]);

	return (
		<div className=" w-full max-w-2xl flex flex-row gap-4 items-center">
			<div className="relative w-full">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search for anime..."
					value={localQuery}
					onChange={(e) => setLocalQuery(e.target.value)}
					className="pl-12 h-14 text-lg bg-card border-border focus-visible:ring-primary shadow-card"
				/>
			</div>
			<FavoritesSidebar />
		</div>
	);
};
