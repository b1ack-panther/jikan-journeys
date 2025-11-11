import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <Card className="group overflow-hidden border-border bg-card hover:shadow-glow transition-all duration-300 h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {anime.score && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-bold text-sm">{anime.score.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {anime.type && (
              <Badge variant="secondary" className="text-xs">
                {anime.type}
              </Badge>
            )}
            {anime.episodes && (
              <Badge variant="outline" className="text-xs">
                {anime.episodes} eps
              </Badge>
            )}
          </div>
          {anime.synopsis && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {anime.synopsis}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
