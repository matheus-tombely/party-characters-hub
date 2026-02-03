import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageCircle, Instagram, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';

export default function Contato() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    dataEvento: '',
    mensagem: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build WhatsApp message
    const message = `Olá! Gostaria de um orçamento:

*Nome:* ${formData.nome}
*Telefone:* ${formData.telefone}
*Data do Evento:* ${formData.dataEvento}
*Mensagem:* ${formData.mensagem}`;

    const whatsappUrl = `https://wa.me/5551999999999?text=${encodeURIComponent(message)}`;
    
    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'budget_request', {
        event_category: 'engagement',
        event_label: 'contact_form',
      });
    }

    window.open(whatsappUrl, '_blank');
    toast.success('Redirecionando para o WhatsApp...');
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <SEO
        title="Contato - Solicite um Orçamento"
        description="Entre em contato para solicitar um orçamento de personagens vivos para sua festa infantil em Porto Alegre. Respondemos rapidamente pelo WhatsApp!"
        canonical="/contato"
      />

      <main className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magic-blue-light text-secondary-foreground mb-4">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Fale Conosco</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Entre em <span className="text-gradient-magic">Contato</span>
          </h1>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Solicite um orçamento para sua festa infantil em Porto Alegre e 
            Região Metropolitana. Respondemos rapidamente!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border-2 border-magic-pink-light rounded-2xl p-6 md:p-8 shadow-soft">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Solicitar Orçamento
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone / WhatsApp *</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(51) 99999-9999"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="dataEvento">Data do Evento *</Label>
                <Input
                  id="dataEvento"
                  name="dataEvento"
                  type="date"
                  required
                  value={formData.dataEvento}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Conte-nos sobre sua festa: qual personagem deseja, local do evento, horário, etc."
                  rows={4}
                  value={formData.mensagem}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-magic shadow-magic hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar pelo WhatsApp'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card border-2 border-magic-blue-light rounded-2xl p-6 md:p-8 shadow-soft">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Informações de Contato
              </h2>

              <div className="space-y-6">
                <a 
                  href="https://wa.me/5551999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white fill-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp</p>
                    <p className="text-muted-foreground">(51) 99999-9999</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/personagensvivosPOA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#E4405F]/10 hover:bg-[#E4405F]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Instagram</p>
                    <p className="text-muted-foreground">@personagensvivosPOA</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">E-mail</p>
                    <p className="text-muted-foreground">contato@personagensvivos.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-accent/30 rounded-2xl p-6 md:p-8 shadow-soft">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Área de Atendimento
              </h2>

              <p className="text-muted-foreground mb-4">
                Atendemos <strong className="text-foreground">Porto Alegre</strong> e toda a{' '}
                <strong className="text-foreground">Região Metropolitana</strong>:
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Canoas',
                  'Novo Hamburgo',
                  'São Leopoldo',
                  'Gravataí',
                  'Viamão',
                  'Cachoeirinha',
                  'Alvorada',
                  'Esteio',
                  'Sapucaia do Sul',
                  'Guaíba',
                ].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 rounded-full bg-magic-gold-light text-accent-foreground text-sm"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
