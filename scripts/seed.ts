import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { statements } from '../server/lib/db.js';

async function seed() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  statements.createUser.run(
    randomUUID(),
    'admin@serius.io',
    'Admin User',
    adminPassword,
    'admin',
    randomUUID()
  );

  // Create analyst user
  const analystPassword = await bcrypt.hash('analyst123', 10);
  statements.createUser.run(
    randomUUID(),
    'analyst@serius.io',
    'Analyst User',
    analystPassword,
    'analyst',
    randomUUID()
  );

  console.log('Seed data created successfully');
}

seed().catch(console.error);