-- Dynamic Pricing Rules Table
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id),
    service_id UUID REFERENCES services(id), -- Optional: apply to specific service or all if null
    rule_name TEXT NOT NULL,
    day_of_week TEXT, -- 'monday', 'tuesday', etc. or 'weekend', 'weekday'
    start_time TIME,
    end_time TIME,
    multiplier NUMERIC NOT NULL DEFAULT 1.0, -- e.g., 1.1 for 10% increase
    type TEXT CHECK (type IN ('increase', 'decrease')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default Rules for all businesses (Example)
-- Note: In a real app, these would be managed per business.
-- These are template rules.

-- RLS Policies
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to read pricing rules" ON pricing_rules
    FOR SELECT USING (TRUE);

CREATE POLICY "Allow business to manage their pricing rules" ON pricing_rules
    FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Adding helper columns to track customer retention in existing tables
-- We can use appointments table for analysis, but adding a materialized view or helper function is better.
-- For now, the API will handle the logic.
