-- Create exhibition_categories table
CREATE TABLE IF NOT EXISTS exhibition_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE exhibition_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on exhibition_categories" 
ON exhibition_categories FOR SELECT 
USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow full access for authenticated users on exhibition_categories"
ON exhibition_categories FOR ALL
USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO exhibition_categories (name, slug, order_index) VALUES
('La Focale', 'la-focale', 1),
('Fotohusli', 'fotohusli', 2),
('Val d''Argent', 'val-argent', 3),
('Autres lieux', 'autres', 4)
ON CONFLICT (name) DO NOTHING;
