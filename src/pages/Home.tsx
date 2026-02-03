import { SEO } from '@/components/SEO';
import { CharacterCard } from '@/components/CharacterCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { Button } from '@/components/ui/button';
import { useCharactersWithViews } from '@/hooks/useCharacters';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Sparkles, Star, Heart, Calendar, Users, Music, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

export default function Home() {
  const { data: characters, isLoading: loadingChars } = useCharactersWithViews();
  const { data: testimonials, isLoading: loadingTestimonials } = useTestimonials();

  const featuredTestimonials = testimonials?.slice(0, 3) || [];

  const handleBudgetClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'budget_request', {
        event_category: 'engagement',
        event_label: 'hero_cta',
      });
    }
  };

  return (
    <>
      <SEO canonical="/" />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          
          <div className="container relative z-10 text-center py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-float">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Magia e encanto para sua festa!</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Personagens Vivos para
              <span className="block text-gradient-magic">Festas Infantis em Porto Alegre</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transforme a festa do seu filho em um verdadeiro conto de fadas! 
              Princesas, heróis e personagens mágicos para eventos inesquecíveis 
              em Porto Alegre e Região Metropolitana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-magic shadow-magic hover:opacity-90 transition-opacity text-lg px-8"
                onClick={handleBudgetClick}
              >
                <a 
                  href="https://wa.me/5551999999999?text=Olá! Gostaria de um orçamento para festa infantil em Porto Alegre"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar Orçamento
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <a href="#personagens">
                  Ver Personagens
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Characters Section */}
        <section id="personagens" className="py-20 bg-gradient-soft">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossos <span className="text-gradient-magic">Personagens</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conheça nossos personagens encantadores! Cada um deles está pronto 
                para fazer da sua festa um momento mágico e inesquecível.
              </p>
            </div>

            {loadingChars ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : characters && characters.length > 0 ? (
              <>
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {characters.map((char) => (
                    <CharacterCard
                      key={char.id}
                      id={char.id}
                      name={char.name}
                      slug={char.slug}
                      description={char.description}
                      coverImage={char.cover_image}
                      viewCount={char.view_count}
                    />
                  ))}
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  <div className="flex gap-4" style={{ width: 'max-content' }}>
                    {characters.map((char) => (
                      <div key={char.id} className="w-[70vw] max-w-[280px] flex-shrink-0">
                        <CharacterCard
                          id={char.id}
                          name={char.name}
                          slug={char.slug}
                          description={char.description}
                          coverImage={char.cover_image}
                          viewCount={char.view_count}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Em breve novos personagens! Entre em contato para saber mais.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Como <span className="text-gradient-magic">Funciona</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Realizamos festas mágicas em Porto Alegre e toda Região Metropolitana. 
                Veja como é simples ter um personagem especial na sua festa!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: 'Escolha a Data',
                  description: 'Entre em contato pelo WhatsApp e informe a data do seu evento. Verificamos a disponibilidade na hora!',
                },
                {
                  icon: Users,
                  title: 'Escolha o Personagem',
                  description: 'Navegue pelo nosso catálogo e escolha o personagem favorito do seu filho. Temos princesas, heróis e muito mais!',
                },
                {
                  icon: Music,
                  title: 'Festa Mágica',
                  description: 'O personagem chega na sua festa com toda a magia, interações, brincadeiras e muita animação para as crianças!',
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="text-center p-6 rounded-2xl bg-card border-2 border-magic-pink-light hover:border-primary transition-colors hover:shadow-magic"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-magic text-white mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-soft">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                O que <span className="text-gradient-magic">Dizem Sobre Nós</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Veja os depoimentos de famílias que realizaram festas mágicas 
                com nossos personagens em Porto Alegre e região.
              </p>
            </div>

            {loadingTestimonials ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : featuredTestimonials.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {featuredTestimonials.map((testimonial) => (
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
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Em breve depoimentos de clientes satisfeitos!
                </p>
              </div>
            )}

            {testimonials && testimonials.length > 3 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/depoimentos">
                    Ver Todos os Depoimentos
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-magic text-white">
          <div className="container text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-6 animate-sparkle" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Pronto para uma Festa Mágica?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Entre em contato agora e reserve seu personagem para a festa mais 
              encantadora de Porto Alegre! Atendemos toda a Região Metropolitana.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg text-lg px-8"
              onClick={handleBudgetClick}
            >
              <a 
                href="https://wa.me/5551999999999?text=Olá! Gostaria de um orçamento para festa infantil"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
