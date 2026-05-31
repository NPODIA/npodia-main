-- membership_applications: 会员申请记录（公开提交，管理员审核后激活）

CREATE TABLE IF NOT EXISTS membership_applications (
  id                UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name        TEXT          NOT NULL,
  last_name         TEXT          NOT NULL,
  email             TEXT          NOT NULL,
  phone             TEXT,
  wechat_id         TEXT,
  membership_tier   TEXT          NOT NULL CHECK (membership_tier IN ('standard', 'aid')),
  message           TEXT,
  -- 管理员审核时填写
  payment_amount    NUMERIC(10,2),
  payment_status    TEXT          NOT NULL DEFAULT 'pending'
                                  CHECK (payment_status IN ('pending', 'confirmed', 'rejected')),
  zelle_reference   TEXT,
  reviewed_by       TEXT,
  reviewed_at       TIMESTAMPTZ,
  notes             TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- RLS 开启（Worker 使用 service_role key，绕过 RLS；前端不直连 DB）
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
