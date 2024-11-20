import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'data.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    password TEXT,
    role TEXT,
    api_key TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    severity TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    created_by_id TEXT,
    tags TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    filename TEXT,
    file_type TEXT,
    file_size INTEGER,
    hash TEXT,
    s3_key TEXT UNIQUE,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    incident_id TEXT,
    metadata TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    action TEXT,
    entity_type TEXT,
    entity_id TEXT,
    user_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    incident_id TEXT,
    evidence_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id),
    FOREIGN KEY (evidence_id) REFERENCES evidence(id)
  );
`);

// Prepare statements for common operations
const statements = {
  // Users
  createUser: db.prepare(`
    INSERT INTO users (id, email, name, password, role, api_key)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserByApiKey: db.prepare('SELECT * FROM users WHERE api_key = ?'),

  // Incidents
  createIncident: db.prepare(`
    INSERT INTO incidents (id, title, description, severity, status, user_id, created_by_id, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  getIncidents: db.prepare('SELECT * FROM incidents ORDER BY created_at DESC'),
  getIncidentById: db.prepare('SELECT * FROM incidents WHERE id = ?'),

  // Evidence
  createEvidence: db.prepare(`
    INSERT INTO evidence (id, filename, file_type, file_size, hash, s3_key, user_id, incident_id, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  getEvidenceById: db.prepare('SELECT * FROM evidence WHERE id = ?'),
  getEvidenceByIncident: db.prepare('SELECT * FROM evidence WHERE incident_id = ?'),

  // Audit Logs
  createAuditLog: db.prepare(`
    INSERT INTO audit_logs (id, action, entity_type, entity_id, user_id, details, ip_address, user_agent, incident_id, evidence_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
};

export { db, statements };