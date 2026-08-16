-- Reference copy of the current D1 schema.
-- The source of truth is the migrations applied via `npm run db:migrate:remote`
-- (see src/db/migrations/0001_init.sql).
--
-- D1 now holds a single table: visitor messages. Site content (i18n) and
-- product info ship with the client bundle, so no other tables are needed.

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  body TEXT NOT NULL,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
