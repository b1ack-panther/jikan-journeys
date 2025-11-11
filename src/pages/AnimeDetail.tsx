import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Tv, Clock, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAnimeById, fetchAnimeCharacters, clearSelectedAnime } from '@/store/animeSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedAnime, characters, loading } = useAppSelector((state) => state.anime);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnimeById(Number(id)));
      dispatch(fetchAnimeCharacters(Number(id)));
    }

    return () => {
      dispatch(clearSelectedAnime());
    };
  }, [id, dispatch]);

  if (loading || !selectedAnime) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[500px]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const mainCharacters = characters.filter(c => c.role === 'Main').slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{
            backgroundImage: `url(${selectedAnime.images.jpg.large_image_url})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <img
              src={selectedAnime.images.jpg.large_image_url}
              alt={selectedAnime.title}
              className="w-64 h-96 object-cover rounded-lg shadow-glow"
            />
            <div className="flex-1 flex flex-col justify-end">
              <Link to="/">
                <Button variant="ghost" className="mb-4 -ml-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Button>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {selectedAnime.title}
              </h1>
              {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
                <p className="text-xl text-muted-foreground mb-2">
                  {selectedAnime.title_english}
                </p>
              )}
              {selectedAnime.title_japanese && (
                <p className="text-lg text-muted-foreground mb-4">
                  {selectedAnime.title_japanese}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedAnime.score && (
                  <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-bold text-lg">{selectedAnime.score.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({selectedAnime.scored_by?.toLocaleString()} users)
                    </span>
                  </div>
                )}
                {selectedAnime.rank && (
                  <div className="bg-secondary/20 px-4 py-2 rounded-lg">
                    <span className="font-bold">Rank #{selectedAnime.rank}</span>
                  </div>
                )}
                {selectedAnime.popularity && (
                  <div className="bg-accent/20 px-4 py-2 rounded-lg">
                    <span className="font-bold">Popularity #{selectedAnime.popularity}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedAnime.genres.map((genre) => (
                  <Badge key={genre.mal_id} variant="default">
                    {genre.name}
                  </Badge>
                ))}
                {selectedAnime.themes.map((theme) => (
                  <Badge key={theme.mal_id} variant="secondary">
                    {theme.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <Card className="border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle>Synopsis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {selectedAnime.synopsis || 'No synopsis available.'}
                </p>
              </CardContent>
            </Card>

            {/* Background */}
            {selectedAnime.background && (
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle>Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {selectedAnime.background}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Characters */}
            {mainCharacters.length > 0 && (
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle>Main Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mainCharacters.map((char) => (
                      <div
                        key={char.character.mal_id}
                        className="group flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <img
                          src={char.character.images.jpg.image_url}
                          alt={char.character.name}
                          className="w-24 h-24 object-cover rounded-full mb-2 ring-2 ring-border group-hover:ring-primary transition-all"
                        />
                        <p className="text-sm font-semibold text-center line-clamp-2">
                          {char.character.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{char.role}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Information */}
            <Card className="border-border bg-card shadow-card">
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Tv className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">{selectedAnime.type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Episodes</p>
                    <p className="font-semibold">{selectedAnime.episodes || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{selectedAnime.status}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Aired</p>
                    <p className="font-semibold">{selectedAnime.aired.string}</p>
                  </div>
                </div>

                {selectedAnime.season && selectedAnime.year && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Season</p>
                      <p className="font-semibold">
                        {selectedAnime.season} {selectedAnime.year}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{selectedAnime.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Members</p>
                    <p className="font-semibold">{selectedAnime.members.toLocaleString()}</p>
                  </div>
                </div>

                {selectedAnime.rating && (
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{selectedAnime.rating}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Studios */}
            {selectedAnime.studios.length > 0 && (
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle>Studios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.studios.map((studio) => (
                      <Badge key={studio.mal_id} variant="outline">
                        {studio.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Producers */}
            {selectedAnime.producers.length > 0 && (
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle>Producers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.producers.map((producer) => (
                      <Badge key={producer.mal_id} variant="outline">
                        {producer.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Demographics */}
            {selectedAnime.demographics.length > 0 && (
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.demographics.map((demo) => (
                      <Badge key={demo.mal_id} variant="secondary">
                        {demo.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
