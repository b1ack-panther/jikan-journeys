import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector } from "@/store/hooks";
import { jikanApi } from "@/services/jikanApi";
import { Anime } from "@/types/anime";
import { AnimeCard } from "./AnimeCard";

const FavoritesSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { favorites } = useAppSelector((state) => state.anime);
	const [favoriteAnimes, setFavoriteAnimes] = useState<Anime[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchFavorites = async () => {
			if (!isOpen || favorites.length === 0) {
				setFavoriteAnimes([]);
				return;
			}
			try {
				setLoading(true);
				setError(null);
				const responses = await Promise.all(
					favorites.map((id) => jikanApi.getAnimeById(id))
				);
				const animes = responses.map((res) => res.data);
				setFavoriteAnimes(animes);
			} catch {
				setError("Failed to load favorites");
			} finally {
				setLoading(false);
			}
		};
		fetchFavorites();
	}, [isOpen, favorites]);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					className="gap-2 hover:outline hover:bg-background transition-all border-primary/20 "
				>
					<Heart className="h-4 w-4 fill-primary text-primary" />
					<span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
						{favorites.length}
					</span>
				</Button>
			</SheetTrigger>

			<SheetContent
				side="right"
				className="w-full max-w-[400px] sm:w-[540px] bg-background"
			>
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2 text-2xl">
						<Heart className="h-6 w-6 fill-primary text-primary" />
						My Favorites
					</SheetTitle>
					<SheetDescription className="text-muted-foreground">
						{favorites.length === 0
							? "You haven't added any favorites yet"
							: `You have ${favorites.length} favorite anime saved`}
					</SheetDescription>
				</SheetHeader>

				<div className="mt-6 flex flex-col h-[calc(100vh-140px)] items-center">
					<ScrollArea className="flex-1 pr-4">
						{favorites.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center p-8">
								<div className="mb-6 relative">
									<Heart className="h-20 w-20 text-muted-foreground/20" />
									<Heart className="h-12 w-12 text-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
								</div>
								<h3 className="text-xl font-bold mb-2">No favorites yet</h3>
								<p className="text-muted-foreground text-sm max-w-xs">
									Start exploring and click the heart icon on anime you love to
									save them here
								</p>
							</div>
						) : loading ? (
							<div className="flex items-center justify-center h-full text-muted-foreground">
								Loading favorites...
							</div>
						) : error ? (
							<div className="flex items-center justify-center h-full text-destructive">
								{error}
							</div>
						) : (
							<div className="flex flex-col gap-y-4 space-y-5">
								{favoriteAnimes.map((anime) => (
									<AnimeCard key={anime.mal_id} anime={anime} />
								))}
							</div>
						)}
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default FavoritesSidebar;
