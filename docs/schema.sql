-- JP-Mirai Portal — Neon PostgreSQL Schema
-- Run this in Neon SQL Editor if tables need to be recreated
-- Last updated: 2026-06-03

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "role" varchar DEFAULT 'user' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "email" varchar NOT NULL,
  "reset_password_token" varchar,
  "reset_password_expiration" timestamp with time zone,
  "salt" varchar,
  "hash" varchar,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" timestamp with time zone
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "users_sessions" (
  "id" varchar PRIMARY KEY,
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now(),
  "expires_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY,
  "alt" varchar,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "url" varchar,
  "thumbnail_u_r_l" varchar,
  "filename" varchar,
  "mime_type" varchar,
  "filesize" numeric,
  "width" numeric,
  "height" numeric,
  "focal_x" numeric,
  "focal_y" numeric
);
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");

CREATE TABLE IF NOT EXISTS "news" (
  "id" serial PRIMARY KEY,
  "cover_image_id" integer REFERENCES "media"("id"),
  "published_at" timestamp with time zone NOT NULL,
  "slug" varchar NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "news_slug_idx" ON "news" ("slug");

CREATE TABLE IF NOT EXISTS "news_locales" (
  "id" serial PRIMARY KEY,
  "title" varchar NOT NULL,
  "summary" varchar,
  "content" jsonb,
  "_locale" varchar NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "news"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "news_locale_parent_id_locale_idx" ON "news_locales" ("_locale", "_parent_id");

CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY,
  "cover_image_id" integer REFERENCES "media"("id"),
  "published_at" timestamp with time zone NOT NULL,
  "slug" varchar NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "messages_slug_idx" ON "messages" ("slug");

CREATE TABLE IF NOT EXISTS "messages_locales" (
  "id" serial PRIMARY KEY,
  "title" varchar NOT NULL,
  "summary" varchar,
  "content" jsonb,
  "_locale" varchar NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "messages"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "messages_locale_parent_id_locale_idx" ON "messages_locales" ("_locale", "_parent_id");

CREATE TABLE IF NOT EXISTS "notices" (
  "id" serial PRIMARY KEY,
  "cover_image_id" integer REFERENCES "media"("id"),
  "published_at" timestamp with time zone NOT NULL,
  "slug" varchar NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "notices_slug_idx" ON "notices" ("slug");

CREATE TABLE IF NOT EXISTS "notices_locales" (
  "id" serial PRIMARY KEY,
  "title" varchar NOT NULL,
  "summary" varchar,
  "content" jsonb,
  "_locale" varchar NOT NULL,
  "_parent_id" integer NOT NULL REFERENCES "notices"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "notices_locale_parent_id_locale_idx" ON "notices_locales" ("_locale", "_parent_id");

CREATE TABLE IF NOT EXISTS "settings" (
  "id" serial PRIMARY KEY,
  "livekit_api_key" varchar,
  "livekit_api_secret" varchar,
  "livekit_url" varchar,
  "smtp_host" varchar DEFAULT 'smtp.gmail.com',
  "smtp_port" numeric DEFAULT 587,
  "smtp_user" varchar,
  "smtp_pass" varchar,
  "staff_email" varchar,
  "socket_port" numeric DEFAULT 3001,
  "max_call_participants" numeric DEFAULT 4,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_profiles" (
  "id" serial PRIMARY KEY,
  "clerk_user_id" varchar NOT NULL,
  "name" varchar,
  "preferred_locale" varchar DEFAULT 'ja',
  "phone" varchar,
  "nationality" varchar,
  "company" varchar,
  "role" varchar DEFAULT 'user',
  "notes" varchar,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_clerk_user_id_idx" ON "user_profiles" ("clerk_user_id");

CREATE TABLE IF NOT EXISTS "consultation_logs" (
  "id" serial PRIMARY KEY,
  "user_id" integer REFERENCES "user_profiles"("id"),
  "staff_id" integer REFERENCES "user_profiles"("id"),
  "type" varchar NOT NULL,
  "status" varchar DEFAULT 'pending',
  "started_at" timestamp with time zone,
  "ended_at" timestamp with time zone,
  "livekit_room" varchar,
  "transcript" jsonb,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  "id" serial PRIMARY KEY,
  "global_slug" varchar,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE,
  "path" varchar NOT NULL,
  "news_id" integer REFERENCES "news"("id") ON DELETE CASCADE,
  "messages_id" integer REFERENCES "messages"("id") ON DELETE CASCADE,
  "notices_id" integer REFERENCES "notices"("id") ON DELETE CASCADE,
  "media_id" integer REFERENCES "media"("id") ON DELETE CASCADE,
  "users_id" integer REFERENCES "users"("id") ON DELETE CASCADE,
  "settings_id" integer REFERENCES "settings"("id") ON DELETE CASCADE,
  "user_profiles_id" integer REFERENCES "user_profiles"("id") ON DELETE CASCADE,
  "consultation_logs_id" integer REFERENCES "consultation_logs"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
  "id" serial PRIMARY KEY,
  "key" varchar,
  "value" jsonb,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  "id" serial PRIMARY KEY,
  "order" integer,
  "parent_id" integer NOT NULL REFERENCES "payload_preferences"("id") ON DELETE CASCADE,
  "path" varchar NOT NULL,
  "users_id" integer REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
  "id" serial PRIMARY KEY,
  "name" varchar,
  "batch" numeric,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
