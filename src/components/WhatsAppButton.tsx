import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const handleClick = () => {
    // Track event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'budget_request', {
        event_category: 'engagement',
        event_label: 'whatsapp_float_button',
      });
    }
  };

  return (
    <a
      href="https://wa.me/5551999999999?text=Olá! Gostaria de um orçamento para festa infantil em Porto Alegre"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300 animate-float"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}
