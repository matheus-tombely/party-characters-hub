import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TestimonialCardProps {
  clientName: string;
  message: string;
  rating: number;
  photoUrl?: string | null;
}

export function TestimonialCard({ clientName, message, rating, photoUrl }: TestimonialCardProps) {
  const initials = clientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="border-2 border-magic-blue-light hover:border-secondary transition-all duration-300 hover:shadow-soft bg-card h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 border-2 border-accent">
            <AvatarImage src={photoUrl || undefined} alt={clientName} />
            <AvatarFallback className="bg-gradient-magic text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{clientName}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? 'text-accent fill-accent'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 italic">
          "{message}"
        </p>
      </CardContent>
    </Card>
  );
}
