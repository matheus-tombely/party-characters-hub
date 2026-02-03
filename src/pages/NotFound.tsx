import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-magic mb-6">
          <Sparkles className="h-10 w-10 text-white animate-sparkle" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Ops! Página não encontrada
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Parece que esta página se perdeu no mundo mágico. 
          Volte para a página inicial e encontre nossos personagens encantadores!
        </p>
        <Button asChild className="bg-gradient-magic shadow-magic hover:opacity-90">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar para o Início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
