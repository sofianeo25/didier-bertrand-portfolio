-- Script to add order_index column to series table
ALTER TABLE public.series ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Optional: update existing rows to have an initial sequential order
WITH numbered_series AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM public.series
)
UPDATE public.series
SET order_index = numbered_series.row_num
FROM numbered_series
WHERE public.series.id = numbered_series.id;
