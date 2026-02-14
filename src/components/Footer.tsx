import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, MapPin, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-soft border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
              Personagens Vivos
            </Link>
            <p className="text-sm text-muted-foreground">
              Transformando festas infantis em contos de fadas mágicos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/depoimentos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/5551991851879" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  (51) 99185-1879
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4 text-primary" />
                <a href="https://instagram.com/estelarpersonagens" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  @estelarpersonagens
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                contato@estelarpersonagens.com.br
              </li>
            </ul>
          </div>

          {/* Region */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Área de Atendimento</h4>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Porto Alegre - RS</p>
                <p>E toda Região Metropolitana</p>
                <p className="text-xs mt-1">Canoas, Novo Hamburgo, São Leopoldo, Gravataí, Viamão, Cachoeirinha e mais</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Feito com <Heart className="h-4 w-4 text-primary fill-primary" /> para encantar
          </p>
          <p className="text-xs text-muted-foreground mt-2"> 
            <Link
  to="/admin"
  className="text-xs opacity-40 hover:opacity-100 transition"
>
  Admin
</Link>
            © {new Date().getFullYear()} Estelar Personagens. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
