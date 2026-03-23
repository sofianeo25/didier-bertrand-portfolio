-- ==============================================================================
-- SCHEMA UPDATE FOR PUBLICATIONS & PAGES (TEXTS)
-- Copy and run this script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create the `publications` table
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    "desc" TEXT,
    cover_url TEXT,
    order_index INTEGER DEFAULT 99,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for `publications`
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public publications are viewable by everyone." 
ON public.publications FOR SELECT USING (true);

CREATE POLICY "Users can insert publications." 
ON public.publications FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update publications." 
ON public.publications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete publications." 
ON public.publications FOR DELETE TO authenticated USING (true);


-- 2. Create the `page_texts` table for editable sections ("A Propos", "Philosophie")
CREATE TABLE IF NOT EXISTS public.page_texts (
    section_id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for `page_texts`
ALTER TABLE public.page_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public page_texts are viewable by everyone." 
ON public.page_texts FOR SELECT USING (true);

CREATE POLICY "Users can insert page_texts." 
ON public.page_texts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update page_texts." 
ON public.page_texts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete page_texts." 
ON public.page_texts FOR DELETE TO authenticated USING (true);

-- 3. Insert default boilerplate texts if they don't exist
INSERT INTO public.page_texts (section_id, content) VALUES
('about_p1', 'Autodidacte de formation, c''est par la passion et l''observation que Je me suis forgé une vision photographique. Inspiré par les maîtres comme Jean-Loup Sieff et Ansel Adams, j’ai appris à nourrir mon œil en voyageant, en attendant, en ressentant.'),
('about_p2', 'Aujourd''hui encore, je refuse de me cloisonner dans un style unique. Nature sauvage, photographie d''architecture Fine Art, portraits de caractère : je laisse le moment choisir pour moi. La technique au service de l''émotion : jamais l''inverse.'),
('philosophy_quote', 'La passion reste la meilleure des écoles. Je n''ai jamais compté les heures dans cet art qu''est la photographie.'),
('philosophy_p1', 'Je pense sincèrement que voir vraiment — c''est-à-dire regarder avec patience, curiosité et absence de jugement — est la compétence la plus précieuse qu''un photographe puisse développer. La technique est un outil. L''œil est tout.'),
('philosophy_p2', 'La photographie Fine Art est pour moi l''aboutissement d''un rendu plus sympathique de l''image : non pas une copie du réel, mais une interprétation, un dialogue entre la lumière et la sensibilité du moment.'),
('hero_sub', 'Depuis plus de vingt ans, Didier Bertrand explore le monde à travers son objectif : du Grand Nord à la steppe asiatique, du studio au désert. Une vision fine art, brute et poétique à la fois.'),
('portfolio_intro', 'Chaque série est le fruit d''une immersion totale — plusieurs jours, parfois plusieurs semaines, dans un même territoire, une même lumière, un même monde.')
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content;
