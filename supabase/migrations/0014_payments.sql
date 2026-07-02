CREATE TYPE payment_type AS ENUM ('booking', 'subscription', 'resource_purchase', 'background_check');

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  payment_type payment_type NOT NULL,
  reference_id UUID, -- booking_id, subscription, resource_id, etc.
  paystack_reference TEXT UNIQUE,
  paystack_access_code TEXT,
  amount_ngn INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | success | failed | refunded
  channel TEXT, -- card | bank | ussd | mobile_money
  currency TEXT DEFAULT 'NGN',
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX payments_user_idx ON payments(user_id);
CREATE INDEX payments_reference_idx ON payments(paystack_reference);
CREATE INDEX payments_status_idx ON payments(status);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own payments" ON payments FOR SELECT USING (user_id = auth.uid() OR auth_is_admin());
CREATE POLICY "System inserts payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
