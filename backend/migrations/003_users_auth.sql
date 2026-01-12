BEGIN;

-- =========================
-- users
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,

  -- UUID خارجي (لـ APIs) بدل كشف id
  uuid UUID NOT NULL DEFAULT uuid_generate_v4(),

  role user_role NOT NULL DEFAULT 'USER',

  full_name TEXT NOT NULL,
  username TEXT UNIQUE,        -- اختياري (للعرض داخل التطبيق)
  phone TEXT UNIQUE,           -- اختياري (للتسجيل/الدخول)
  email TEXT UNIQUE,           -- اختياري (للتسجيل/الدخول)

  password_hash TEXT NOT NULL,

  -- اختيار المنطقة/البلوك/العمارة (اختياري بالبداية)
  area_id INT REFERENCES areas(id) ON DELETE SET NULL,
  block_id INT REFERENCES blocks(id) ON DELETE SET NULL,
  building_id INT REFERENCES buildings(id) ON DELETE SET NULL,
  apartment_id INT REFERENCES apartments(id) ON DELETE SET NULL,

  -- بيانات عامة لا تُخفى حسب فكرتك
  age INT,

  -- أشياء إضافية
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_uuid_unique UNIQUE (uuid)
);

-- تحديث updated_at تلقائياً
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- فهارس مساعدة
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_area ON users(area_id);

COMMIT;
