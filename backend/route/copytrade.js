import express from 'express';
import ccxt from 'ccxt';
const router = express.Router();

// Binance ve OKX örnek API anahtarları
const API_KEY = '123981723981273';
const API_SECRET = '123981723981273';

// Güncel işlemleri çek (örnek: Binance)
router.get('/binance-trades', async (req, res) => {
  try {
    const binance = new ccxt.binance({ apiKey: API_KEY, secret: API_SECRET });
    const trades = await binance.fetchMyTrades('BTC/USDT', undefined, 10);
    res.json(trades);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Copy trade başlat (örnek: Binance)
router.post('/binance-copy', async (req, res) => {
  const { symbol, side, amount } = req.body;
  try {
    const binance = new ccxt.binance({ apiKey: API_KEY, secret: API_SECRET });
    let order;
    if (side === 'buy') {
      order = await binance.createMarketBuyOrder(symbol, amount);
    } else {
      order = await binance.createMarketSellOrder(symbol, amount);
    }
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// OKX işlemleri ve copy trade için benzer endpointler eklenebilir

export default router;
