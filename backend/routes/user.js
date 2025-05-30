import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/users.json');

/**
 * Reads users.json, returns array. If file is missing or contains invalid JSON,
 * resets it to an empty array.
 */
async function readUsers() {
  let raw;
  try {
    raw = await fs.readFile(USERS_FILE, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found: create a new empty array
      await fs.writeFile(USERS_FILE, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Invalid JSON: warn and reset file
    console.warn('users.json invalid, resetting:', err);
    await fs.writeFile(USERS_FILE, '[]', 'utf-8');
    return [];
  }
}

/**
 * Writes users array to users.json with pretty-print.
 */
async function writeUsers(users) {
  const json = JSON.stringify(users, null, 2);
  await fs.writeFile(USERS_FILE, json, 'utf-8');
}

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Eksik bilgi.' });
    }

    const users = await readUsers();
    if (users.some(u => u.username === username)) {
      return res.status(409).json({ error: 'Kullanıcı mevcut.' });
    }

    users.push({ username, password });
    await writeUsers(users);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
});

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
});

export default router;
