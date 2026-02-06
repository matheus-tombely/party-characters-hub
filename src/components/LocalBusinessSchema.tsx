export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Personagens Vivos Porto Alegre",
    description:
      "Personagens vivos para festas infantis em Porto Alegre e Região Metropolitana.",
    url: "https://estelarpersonagens.com.br",
    telephone: "+55-51-99185-1879",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Porto Alegre",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-30.0346",
      longitude: "-51.2177",
    },
    areaServed: [
      { "@type": "City", name: "Porto Alegre, Canoas, Gravataí, São Leopoldo, Novo Hamburgo, Viamão, Alvorada, Cachoeirinha, Esteio, Sapucaia do Sul e Guaíba " },
      { "@type": "State", name: "Rio Grande do Sul" },
    ],
    priceRange: "$$",
    openingHours: "Mo-Su 08:00-22:00",
    sameAs: [
      "https://instagram.com/estelarpersonagens",
      "https://facebook.com/estelarpersonagens",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
