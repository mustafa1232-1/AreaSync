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
  username TEXT UNIQUE,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,

  password_hash TEXT NOT NULL,

  -- اختيار المنطقة/البلوك/العمارة (اختياري)
  area_id INT REFERENCES areas(id) ON DELETE SET NULL,
  block_id INT REFERENCES blocks(id) ON DELETE SET NULL,
  building_id INT REFERENCES buildings(id) ON DELETE SET NULL,
  apartment_id INT REFERENCES apartments(id) ON DELETE SET NULL,

  -- بيانات عامة حسب فكرتك
  age INT,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT users_uuid_unique UNIQUE (uuid)
);

-- =========================
-- Function: set_updated_at
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- =========================
-- Trigger: users updated_at
-- =========================
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_area_id ON users(area_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

COMMIT;
