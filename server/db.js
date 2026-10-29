const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = process.env.DB_PATH || path.join(__dirname, 'emissium.db')
fs.mkdirSync(path.dirname(dbPath), { recursive: true })
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid          INTEGER PRIMARY KEY AUTOINCREMENT,
    login        TEXT    NOT NULL UNIQUE,
    email        TEXT    NOT NULL UNIQUE,
    password     TEXT    NOT NULL,
    version      TEXT    NOT NULL DEFAULT 'none',
    sub_started  TEXT    DEFAULT NULL,
    sub_expires  TEXT    DEFAULT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`)

// Миграция — добавляем колонки если их нет (для существующей БД)
const columns = db.pragma('table_info(users)').map(c => c.name)

if (!columns.includes('sub_started')) {
  db.exec(`ALTER TABLE users ADD COLUMN sub_started TEXT DEFAULT NULL`)
}
if (!columns.includes('sub_expires')) {
  db.exec(`ALTER TABLE users ADD COLUMN sub_expires TEXT DEFAULT NULL`)
}

module.exports = db
