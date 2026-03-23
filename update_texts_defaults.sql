-- ==============================================================================
-- ADD DEFAULT VALUES FOR NEW TEXT SECTIONS
-- Copy and run this script in the Supabase SQL Editor
-- ==============================================================================

INSERT INTO public.page_texts (section_id, content) VALUES
('hero_sub', 'Depuis plus de vingt ans, Didier Bertrand explore le monde à travers son objectif — du Grand Nord à la steppe asiatique, du studio au désert. Une vision fine art, brute et poétique à la fois.'),
('portfolio_intro', 'Chaque série est le fruit d''une immersion totale — plusieurs jours, parfois plusieurs semaines, dans un même territoire, une même lumière, un même monde.')
ON CONFLICT (section_id) DO UPDATE SET content = EXCLUDED.content WHERE public.page_texts.content = '';
