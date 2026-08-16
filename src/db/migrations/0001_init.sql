-- Initial schema for the zkraft.cc landing page.
-- D1 stores a single table: visitor messages. Site content (i18n) and product
-- info ship with the client bundle, so no other tables are needed.

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  body TEXT NOT NULL,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
