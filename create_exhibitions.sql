-- Create exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    venue TEXT NOT NULL,
    location TEXT,
    poster_url TEXT,
    category TEXT, -- e.g., 'la-focale', 'fotohusli', 'val-argent', 'autres'
    order_index INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on exhibitions" 
ON exhibitions FOR SELECT 
USING (true);

-- Create policy for admin full access (using service role or similar - for now simple bypass if needed)
-- Note: In a production app, you'd specify authenticated roles.
CREATE POLICY "Allow full access for authenticated users on exhibitions"
ON exhibitions FOR ALL
USING (auth.role() = 'authenticated');
