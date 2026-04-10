-- Inventory Table for Salon Supplies
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'adet', -- 'adet', 'ml', 'gr', 'paket'
    low_stock_threshold INTEGER DEFAULT 5,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read inventory" ON inventory
    FOR SELECT USING (TRUE);

CREATE POLICY "Allow business owners to manage their inventory" ON inventory
    FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_business ON inventory(business_id);
