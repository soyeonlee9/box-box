-- 1. Add notification_preferences to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "inApp": true, "weekly_report": true, "campaign_milestone": true, "badge_earned": true, "important_updates": true}'::jsonb;

-- 2. Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'system', 'campaign_milestone', 'badge_earned', 'weekly_report'
    channel VARCHAR(20) NOT NULL, -- 'in_app', 'email'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We assume uuid-ossp extension is enabled (uuid_generate_v4)
