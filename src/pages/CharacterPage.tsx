import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCharacterBySlug, useCharacterMedia, useRecordView, useCharacterViewCount } from '@/hooks/useCharacters';
import { ChevronLeft, ChevronRight, Eye, Play, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function CharacterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: character, isLoading, error } = useCharacterBySlug(slug || '');
  const { data: media } = useCharacterMedia(character?.id || '');
  const { data: viewCount } = useCharacterViewCount(character?.id || '');
  const recordView = useRecordView();

  useEffect(() => {
    if (character?.id) {
      recordView.mutate(character.id);
    }
  }, [character?.id]);

  const handleBudgetClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'budget_request', {
        event_category: 'engagement',
        event_label: `character_${character?.slug}`,
        character_name: character?.name,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-20">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container py-20 text-center">
        <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
          Personagem não encontrado
        </h1>
        <p className="text-muted-foreground mb-8">
          O personagem que você está procurando não existe ou foi removido.
        </p>
        <Button asChild>
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Link>
        </Button>
      </div>
    );
  }

  const images = media?.filter((m) => m.type === 'image') || [];
  const videos = media?.filter((m) => m.type === 'video') || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${character.name} - Personagem para Festa Infantil`,
    "description": character.description || `Contrate ${character.name} para sua festa infantil em Porto Alegre`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Personagens Vivos Porto Alegre",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Porto Alegre",
        "addressRegion": "RS",
        "addressCountry": "BR"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Porto Alegre"
    },
    "image": character.cover_image,
  };

  return (
    <>
      <SEO
        title={`${character.name} - Personagem para Festa Infantil`}
        description={character.description || `Contrate ${character.name} para sua festa infantil em Porto Alegre e Região Metropolitana. Personagem vivo com animação e brincadeiras mágicas!`}
        canonical={`/personagem/${character.slug}`}
        image={character.cover_image || undefined}
        schema={schema}
      />

      <main className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para Personagens
          </Link>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Cover Image */}
          <div className="relative">
            {character.cover_image ? (
              <img
                src={character.cover_image}
                alt={`${character.name} - Personagem para festa infantil em Porto Alegre`}
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-magic"
              />
            ) : (
              <div className="w-full aspect-[3/4] rounded-2xl bg-gradient-magic flex items-center justify-center">
                <Sparkles className="h-24 w-24 text-white/80 animate-sparkle" />
              </div>
            )}
            
            {viewCount !== undefined && viewCount > 0 && (
              <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                <Eye className="h-3 w-3 mr-1" />
                {viewCount} visualizações
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {character.name}
            </h1>

            {character.description && (
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {character.description}
              </p>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Animação interativa com as crianças</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Brincadeiras e músicas temáticas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Fotos com o personagem</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Atendemos Porto Alegre e Região Metropolitana</span>
              </div>
            </div>

            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-magic shadow-magic hover:opacity-90 transition-opacity w-full md:w-auto"
              onClick={handleBudgetClick}
            >
              <a 
                href={`https://wa.me/5551999999999?text=Olá! Gostaria de um orçamento para o personagem ${character.name} para minha festa infantil em Porto Alegre`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar Orçamento
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              Galeria de Fotos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={img.url}
                    alt={`${character.name} em festa infantil`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Play className="h-6 w-6 text-primary" />
              Vídeos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => {
                const isYouTube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
                const getYouTubeId = (url: string) => {
                  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                  return match?.[1] || '';
                };

                return (
                  <div key={video.id} className="aspect-video rounded-xl overflow-hidden bg-muted">
                    {isYouTube ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                        title={`Vídeo de ${character.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
