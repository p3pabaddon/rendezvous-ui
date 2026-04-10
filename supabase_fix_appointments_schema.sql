-- Fix appointments schema to separate service info from notes
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS service_name TEXT;

-- Optional: Migrate existing data from notes to service_name if notes contains common service patterns
-- (For now we just ensure the column exists for new records)
