-- Professional Operations & Loyalty 2.0 SQL
-- Phase 5 Fixes & Scalability (Redundant execution safe)

-- 1. Fix Customer Notes Table
-- Unique constraint eklemeden önce kontrol et
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_notes_business_phone_key') THEN
        ALTER TABLE customer_notes ADD CONSTRAINT customer_notes_business_phone_key UNIQUE (business_id, customer_phone);
    END IF;
END $$;

-- 2. Loyalty Table RLS Enhancements

-- Önce eski politikaları temizle (Hata almamak için)
DROP POLICY IF EXISTS "Loyalty programs are viewable by everyone" ON loyalty_programs;
DROP POLICY IF EXISTS "Loyalty logs are viewable by matching phone" ON loyalty_logs;

-- Yeniden oluştur
CREATE POLICY "Loyalty programs are viewable by everyone" 
ON loyalty_programs FOR SELECT 
USING (true);

CREATE POLICY "Loyalty logs are viewable by matching phone" 
ON loyalty_logs FOR SELECT 
USING (true);

-- 3. Add Business Description for AI Marketing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='marketing_bio') THEN
        ALTER TABLE businesses ADD COLUMN marketing_bio TEXT;
    END IF;
END $$;
