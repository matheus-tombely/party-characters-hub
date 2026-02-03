import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object;
}

const defaultTitle = "Personagens Vivos Porto Alegre | Princesas e Heróis para Festas Infantis";
const defaultDescription = "Transforme a festa do seu filho em um conto de fadas! Personagens vivos para festas infantis em Porto Alegre e Região Metropolitana. Princesas, heróis e animação mágica.";
const defaultImage = "/og-image.jpg";
const siteUrl = window.location.origin;

export function SEO({ 
  title = defaultTitle,
  description = defaultDescription,
  canonical,
  image = defaultImage,
  type = 'website',
  schema
}: SEOProps) {
  const fullTitle = title === defaultTitle ? title : `${title} | Personagens Vivos Porto Alegre`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Personagens Vivos Porto Alegre",
    "description": defaultDescription,
    "url": siteUrl,
    "telephone": "+55-51-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Porto Alegre",
      "addressRegion": "RS",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-30.0346",
      "longitude": "-51.2177"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Porto Alegre"
      },
      {
        "@type": "State",
        "name": "Rio Grande do Sul"
      }
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Su 08:00-22:00",
    "image": imageUrl,
    "sameAs": [
      "https://instagram.com/personagensvivosPOA",
      "https://facebook.com/personagensvivosPOA"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Personagens Vivos Porto Alegre" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Personagens Vivos Porto Alegre" />
      <meta name="geo.region" content="BR-RS" />
      <meta name="geo.placename" content="Porto Alegre" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
}
