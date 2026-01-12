-- =====================================================
-- 001_init_extensions_and_enums.sql
-- AreaSync Platform
-- =====================================================
-- هذا الملف:
-- - يجهز البيئة
-- - ينشئ Extensions
-- - ينشئ Enums العامة التي نحتاجها لاحقاً
-- =====================================================

BEGIN;

-- =========================
-- Extensions
-- =========================
-- نحتاج UUID للتوسع لاحقاً
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Enums: Users & Roles
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'USER',
      'BUSINESS',
      'DEVELOPER'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Business
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status') THEN
    CREATE TYPE business_status AS ENUM (
      'PENDING',
      'ACTIVE',
      'SUSPENDED'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Posts / Social
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_scope') THEN
    CREATE TYPE post_scope AS ENUM (
      'AREA',
      'BLOCK',
      'BUILDING'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_kind') THEN
    CREATE TYPE post_kind AS ENUM (
      'COMMUNITY',   -- منشورات عامة (منطقة/بلوك/عمارة)
      'PROFILE'      -- منشورات شخصية
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_audience') THEN
    CREATE TYPE post_audience AS ENUM (
      'PUBLIC',
      'CONNECTIONS',
      'ONLY_ME'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Reactions
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reaction_type') THEN
    CREATE TYPE reaction_type AS ENUM (
      'LIKE',
      'LOVE',
      'HAHA',
      'WOW',
      'SAD',
      'ANGRY'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Reports (Self Moderation)
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_target_type') THEN
    CREATE TYPE report_target_type AS ENUM (
      'POST',
      'COMMENT',
      'USER'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE report_status AS ENUM (
      'OPEN',
      'RESOLVED',
      'DISMISSED'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Listings / Services
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
    CREATE TYPE listing_type AS ENUM (
      'RESTAURANT',
      'CARS',
      'RENT',
      'HOME_FOOD',
      'SHOP_SMALL',
      'SHOP_BIG',
      'SERVICE'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
    CREATE TYPE availability_status AS ENUM (
      'AVAILABLE',
      'BUSY',
      'CLOSED'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Chat
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_room_type') THEN
    CREATE TYPE chat_room_type AS ENUM (
      'BUILDING',
      'BLOCK',
      'DM'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Orders / Delivery
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'PLACED',
      'CONFIRMED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_status') THEN
    CREATE TYPE delivery_status AS ENUM (
      'SEARCHING',
      'ASSIGNED',
      'PICKING_UP',
      'DROPPING_OFF',
      'COMPLETED',
      'CANCELLED'
    );
  END IF;
END$$;

-- =====================================================
-- Enums: Taxi
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taxi_request_status') THEN
    CREATE TYPE taxi_request_status AS ENUM (
      'OPEN',
      'ASSIGNED',
      'CANCELLED',
      'COMPLETED'
    );
  END IF;
END$$;

COMMIT;
