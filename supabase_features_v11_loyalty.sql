-- Phase 1: Growth & Loyalty Migration

-- 1. Update Businesses table with Premium/Featured features
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS referral_active BOOLEAN DEFAULT TRUE;

-- 2. Loyalty Programs Table
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    target_stamps INTEGER DEFAULT 10,
    reward_title TEXT NOT NULL, -- e.g. "Ücretsiz Saç Kesimi"
    reward_type TEXT DEFAULT 'free_service', -- 'free_service', 'discount_fixed', 'discount_percent'
    reward_value DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id)
);

-- 3. Customer Loyalty Progress
CREATE TABLE IF NOT EXISTS customer_loyalty (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, 
    current_stamps INTEGER DEFAULT 0,
    total_completed_appointments INTEGER DEFAULT 0,
    last_stamp_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, customer_id)
);

-- 4. Referral System
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Promo Codes (Used for Rewards)
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    business_id UUID REFERENCES businesses(id), -- NULL if global (portal-wide)
    discount_type TEXT NOT NULL, -- 'percent', 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    customer_id UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable RLS
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- 7. Policies
CREATE POLICY "Loyalty programs are viewable by everyone" ON loyalty_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Business owners can manage their loyalty programs" ON loyalty_programs FOR ALL USING (
    EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid())
);

CREATE POLICY "Customers can view their own loyalty progress" ON customer_loyalty FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "System/Owners can update loyalty" ON customer_loyalty FOR ALL USING (TRUE);

CREATE POLICY "Referrals are viewable by referrer/referred" ON referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());
CREATE POLICY "Promo codes are viewable by owner" ON promo_codes FOR SELECT USING (customer_id = auth.uid());
