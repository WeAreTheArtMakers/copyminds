import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/user.js';
import copytradeRoutes from './routes/copytrade.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Render veya benzeri platformlarda doğru port'u kullan
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// public klasöründeki statik dosyaları sun
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa olarak app.html'i döndür
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// API rotaları
app.use('/api/user', userRoutes);
app.use('/api/copytrade', copytradeRoutes);

// Eğer istersen bir health check endpoint'i ekle
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor.`);
});
