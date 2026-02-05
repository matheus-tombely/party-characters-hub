import { SEO } from '@/components/SEO';
import { TestimonialCard } from '@/components/TestimonialCard';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Heart, Star } from 'lucide-react';

export default function Depoimentos() {
  const { data: testimonials, isLoading } = useTestimonials();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Depoimentos de Clientes - Personagens Vivos Porto Alegre",
    "itemListElement": testimonials?.map((t, index) => ({
      "@type": "Review",
      "position": index + 1,
      "author": {
        "@type": "Person",
        "name": t.client_name,
      },
      "reviewBody": t.message,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": t.rating,
        "bestRating": 5,
      },
      "itemReviewed": {
        "@type": "LocalBusiness",
        "name": "Personagens Vivos Porto Alegre",
      },
    })) || [],
  };

  return (
    <>
      <SEO
        title="Depoimentos de Clientes"
        description="Veja o que nossos clientes dizem sobre as festas mágicas com personagens vivos em Porto Alegre. Avaliações reais de famílias satisfeitas!"
        canonical="/depoimentos"
        schema={schema}
      />

      <main className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magic-pink-light text-primary mb-4">
            <Heart className="h-4 w-4 fill-primary" />
            <span className="text-sm font-medium">Clientes Felizes</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que <span className="text-gradient-magic">Dizem Sobre Nós</span>
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Confira os depoimentos de famílias que realizaram festas mágicas 
            com a equipe Estelar
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                clientName={testimonial.client_name}
                message={testimonial.message}
                rating={testimonial.rating}
                photoUrl={testimonial.photo_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              Em breve teremos depoimentos!
            </h2>
            <p className="text-muted-foreground">
              Estamos coletando avaliações dos nossos clientes.
            </p>
          </div>
        )}

        {/* Stats */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: testimonials.length, label: 'Depoimentos' },
              { 
                value: (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1), 
                label: 'Nota Média' 
              },
              { 
                value: `${Math.round((testimonials.filter(t => t.rating >= 4).length / testimonials.length) * 100)}%`, 
                label: 'Aprovação' 
              },
              { value: '100+', label: 'Festas Realizadas' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="text-center p-6 rounded-2xl bg-card border-2 border-magic-pink-light"
              >
                <p className="font-serif text-3xl font-bold text-gradient-magic">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
