import { memo } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "@/types/anime";

interface FilterBarProps {
	filters: SearchFilters;
	onFiltersChange: (filters: SearchFilters) => void;
}

const POPULAR_GENRES = [
	{ id: 1, name: "Action" },
	{ id: 2, name: "Adventure" },
	{ id: 4, name: "Comedy" },
	{ id: 8, name: "Drama" },
	{ id: 10, name: "Fantasy" },
	{ id: 22, name: "Romance" },
	{ id: 24, name: "Sci-Fi" },
	{ id: 36, name: "Slice of Life" },
];

const RATINGS = [
	{ value: "g", label: "G - All Ages" },
	{ value: "pg", label: "PG - Children" },
	{ value: "pg13", label: "PG-13 - Teens 13+" },
	{ value: "r17", label: "R - 17+" },
	{ value: "r", label: "R+ - Mild Nudity" },
];

const SCORE_RANGES = [
	{ min: 8, max: 10, label: "8.0 - 10.0" },
	{ min: 6, max: 8, label: "6.0 - 8.0" },
	{ min: 4, max: 6, label: "4.0 - 6.0" },
	{ min: 0, max: 4, label: "0.0 - 4.0" },
];

export const FilterBar = memo(
	({ filters, onFiltersChange }: FilterBarProps) => {
		const toggleGenre = (genreId: number) => {
			const currentGenres = filters.genres || [];
			const newGenres = currentGenres.includes(genreId)
				? currentGenres.filter((id) => id !== genreId)
				: [...currentGenres, genreId];

			onFiltersChange({
				...filters,
				genres: newGenres.length > 0 ? newGenres : undefined,
			});
		};

		const setRating = (rating: string) => {
			onFiltersChange({
				...filters,
				rating: rating === "all" ? undefined : rating,
			});
		};

		const setScoreRange = (range: string) => {
			if (range === "all") {
				const { minScore, maxScore, ...rest } = filters;
				onFiltersChange(rest);
			} else {
				const selectedRange = SCORE_RANGES.find(
					(r) => `${r.min}-${r.max}` === range
				);
				if (selectedRange) {
					onFiltersChange({
						...filters,
						minScore: selectedRange.min,
						maxScore: selectedRange.max,
					});
				}
			}
		};

		const clearFilters = () => {
			onFiltersChange({});
		};

		const hasActiveFilters =
			(filters.genres && filters.genres.length > 0) ||
			filters.rating ||
			filters.minScore !== undefined;

		return (
			<div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
				<div className="flex items-center  justify-between">
					<div className="flex items-center flex-row gap-2">
						<Filter className="h-5 w-5 text-primary" />
						<h3 className="font-semibold">Filters</h3>
					</div>
					{hasActiveFilters && (
						<Button variant="ghost" size="sm" onClick={clearFilters}>
							<X className="h-4 w-4 mr-1" />
							Clear All
						</Button>
					)}
				</div>

				{/* Genres */}
				<div className="space-y-2 flex gap-2 items-center">
					<label className="text-sm font-medium text-muted-foreground">
						Genres
					</label>
					<div className="flex flex-wrap gap-2">
						{POPULAR_GENRES.map((genre) => (
							<Badge
								key={genre.id}
								variant={
									filters.genres?.includes(genre.id) ? "default" : "outline"
								}
								className="cursor-pointer hover:bg-primary/20 transition-colors"
								onClick={() => toggleGenre(genre.id)}
							>
								{genre.name}
							</Badge>
						))}
					</div>
				</div>

				{/* Rating and Score */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">
							Rating
						</label>
						<Select value={filters.rating || "all"} onValueChange={setRating}>
							<SelectTrigger>
								<SelectValue placeholder="All Ratings" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Ratings</SelectItem>
								{RATINGS.map((rating) => (
									<SelectItem key={rating.value} value={rating.value}>
										{rating.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">
							Score Range
						</label>
						<Select
							value={
								filters.minScore !== undefined
									? `${filters.minScore}-${filters.maxScore}`
									: "all"
							}
							onValueChange={setScoreRange}
						>
							<SelectTrigger>
								<SelectValue placeholder="All Scores" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Scores</SelectItem>
								{SCORE_RANGES.map((range) => (
									<SelectItem
										key={`${range.min}-${range.max}`}
										value={`${range.min}-${range.max}`}
									>
										{range.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
		);
	}
);
