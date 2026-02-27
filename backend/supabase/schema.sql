-- 1. users: 사용자 정보 (소셜 로그인 정보 포함)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL, -- Supabase Auth의 id와 매핑
  email VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL, -- google, kakao 등
  name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'brand', -- 'super_admin' or 'brand'
  brand_id UUID, -- 소속 브랜드 (super_admin인 경우 NULL일 수 있음)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. brands: 브랜드(고객사) 정보
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  manager_email VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. campaigns: QR 캠페인 정보 
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  url_b TEXT, -- AB 테스트용 alternate url
  is_active BOOLEAN DEFAULT true,
  is_ab_test BOOLEAN DEFAULT false,
  original_cpa INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. qr_scans: 개별 QR 스캔 이벤트 기록
CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- 비회원 스캔도 허용 가능
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location VARCHAR(100), -- 예: '서울 강남구'
  device_type VARCHAR(50), -- 예: 'iOS Safari'
  ip_address VARCHAR(45),
  metadata JSONB -- 추가 분석 정보
);

-- 5. badges: 3D 배지 정보
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  trigger_condition JSONB, -- 배지 획득 조건 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. user_badges: 사용자가 획득한 배지 목록
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id) -- 중복 획득 불가
);

-- 7. rewards: 리워드 정보
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE SET NULL, -- 어떤 배지를 얻어 받은 리워드인지 추적
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code VARCHAR(100) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
