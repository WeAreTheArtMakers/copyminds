import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import copytradeRoutes from './routes/copytrade.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// public içindekileri her istekte sun:
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfada app.html’i otomatik göster:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.use('/api/user', userRoutes);
app.use('/api/copytrade', copytradeRoutes);

app.get('/', (req, res) => {
  res.send('CopyTrade Backend Çalışıyor!');
});

app.listen(PORT, () => {
  console.log(`Backend ${PORT} portunda çalışıyor.`);
});
