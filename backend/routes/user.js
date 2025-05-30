// routes/user.js
import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
// data klasörünün içindeki users.json dosyası
const USERS_FILE = path.join(__dirname, '../data/users.json');

/**
 * users.json'u okur; yoksa [] döner ve dosyayı yaratır.
 */
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      // Dosya yoksa boş dizi olarak yarat
      await fs.writeFile(USERS_FILE, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

/**
 * users dizisini pretty‐print ile users.json'a yazar.
 */
async function writeUsers(users) {
  const json = JSON.stringify(users, null, 2);
  await fs.writeFile(USERS_FILE, json, 'utf-8');
}

// POST /api/user/register
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
  }
  catch (err) {
    console.error('Register error:', err);
    next(err);
  }
});

// POST /api/user/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
    }

    return res.json({ success: true });
  }
  catch (err) {
    console.error('Login error:', err);
    next(err);
  }
});

export default router;
