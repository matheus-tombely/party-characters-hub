    -- Criar tabela de personagens
    CREATE TABLE public.characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        cover_image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Criar tabela de mídia dos personagens
    CREATE TABLE public.character_media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('image', 'video')),
        url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Criar tabela de visualizações dos personagens
    CREATE TABLE public.character_views (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Criar tabela de depoimentos
    CREATE TABLE public.testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_name TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        photo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );

    -- Habilitar RLS em todas as tabelas
    ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.character_media ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.character_views ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

    -- Políticas públicas de leitura (todos podem ver)
    CREATE POLICY "Public can view characters" ON public.characters FOR SELECT USING (true);
    CREATE POLICY "Public can view character media" ON public.character_media FOR SELECT USING (true);
    CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

    -- Política para inserir views (qualquer um pode registrar uma visualização)
    CREATE POLICY "Anyone can insert character views" ON public.character_views FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public can view character views" ON public.character_views FOR SELECT USING (true);

    -- Políticas de admin (usuários autenticados podem gerenciar)
    CREATE POLICY "Authenticated users can insert characters" ON public.characters FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Authenticated users can update characters" ON public.characters FOR UPDATE TO authenticated USING (true);
    CREATE POLICY "Authenticated users can delete characters" ON public.characters FOR DELETE TO authenticated USING (true);

    CREATE POLICY "Authenticated users can insert character media" ON public.character_media FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Authenticated users can update character media" ON public.character_media FOR UPDATE TO authenticated USING (true);
    CREATE POLICY "Authenticated users can delete character media" ON public.character_media FOR DELETE TO authenticated USING (true);

    CREATE POLICY "Authenticated users can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Authenticated users can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
    CREATE POLICY "Authenticated users can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);

    -- Criar bucket para imagens de personagens
    INSERT INTO storage.buckets (id, name, public) VALUES ('characters', 'characters', true);

    -- Políticas de storage
    CREATE POLICY "Public can view character images" ON storage.objects FOR SELECT USING (bucket_id = 'characters');
    CREATE POLICY "Authenticated users can upload character images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'characters');
    CREATE POLICY "Authenticated users can update character images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'characters');
    CREATE POLICY "Authenticated users can delete character images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'characters');

    -- Criar índices para performance
    CREATE INDEX idx_character_media_character_id ON public.character_media(character_id);
    CREATE INDEX idx_character_views_character_id ON public.character_views(character_id);
    CREATE INDEX idx_characters_slug ON public.characters(slug);