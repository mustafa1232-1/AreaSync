BEGIN;

-- =========================
-- Areas
-- =========================
CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Blocks
-- =========================
CREATE TABLE IF NOT EXISTS blocks (
  id SERIAL PRIMARY KEY,
  area_id INT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, code)
);

-- =========================
-- Buildings
-- =========================
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  block_id INT NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(block_id, code)
);

-- =========================
-- Apartments (شقق)
-- =========================
CREATE TABLE IF NOT EXISTS apartments (
  id SERIAL PRIMARY KEY,
  building_id INT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  floor INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(building_id, number)
);

COMMIT;
