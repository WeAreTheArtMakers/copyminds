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
// Render ya da başka bir platform PORT değişkeni atıyorsa onu al, yoksa 4000
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

// Bizde her yol var :) WeAreTheArtMakers
app.use('/routes/user', userRoutes);
app.use('/routes/copytrade', copytradeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Tüm arayüzlerden gelen isteklere açık şekilde dinle
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend ${PORT} portunda, tüm arayüzlerden erişime açık.`);
});
