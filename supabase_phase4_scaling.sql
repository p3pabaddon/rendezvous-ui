-- Enable UPDATE for businesses (Owner or all for demo)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to update businesses (demo)"
    ON businesses FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id),
    referee_email TEXT,
    code TEXT UNIQUE,
    status TEXT DEFAULT 'pending', -- pending, accepted, rewarded
    reward_amount INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Loyalty Logs Table
CREATE TABLE IF NOT EXISTS loyalty_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id),
    business_id UUID REFERENCES businesses(id),
    appointment_id UUID REFERENCES appointments(id),
    stamps_added INTEGER DEFAULT 1,
    action_type TEXT DEFAULT 'appointment_complete',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for new tables
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow managed access to referrals" ON referrals FOR ALL USING (true);
CREATE POLICY "Allow managed access to loyalty logs" ON loyalty_logs FOR ALL USING (true);
