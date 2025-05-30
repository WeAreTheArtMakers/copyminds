import express from 'express';
import fs from 'fs';
const router = express.Router();

const USERS_FILE = new URL('../data/users.json', import.meta.url);

// Kullanıcı kaydı
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Eksik bilgi.' });
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {}
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'Kullanıcı mevcut.' });
  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.json({ success: true });
});

// Kullanıcı girişi
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {}
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı.' });
  res.json({ success: true });
});

export default router;
