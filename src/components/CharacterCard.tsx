import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CharacterCardProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  viewCount?: number;
  onClick?: () => void;
}

export function CharacterCard({ 
  name, 
  slug, 
  description, 
  coverImage, 
  viewCount,
  onClick 
}: CharacterCardProps) {
  const handleClick = () => {
    // Track event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'character_click', {
        event_category: 'engagement',
        event_label: name,
        character_slug: slug,
      });
    }
    onClick?.();
  };

  return (
    <Link to={`/personagem/${slug}`} onClick={handleClick}>
      <Card className="group overflow-hidden border-2 border-magic-pink-light hover:border-primary transition-all duration-300 hover:shadow-magic hover:-translate-y-1 bg-card">
        <div className="relative aspect-[3/4] overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Personagem ${name} para festa infantil em Porto Alegre`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-magic flex items-center justify-center">
              <Star className="h-16 w-16 text-white/80 animate-sparkle" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {viewCount !== undefined && viewCount > 0 && (
            <Badge className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background">
              <Eye className="h-3 w-3 mr-1" />
              {viewCount}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
