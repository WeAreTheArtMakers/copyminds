// Fake data and rendering logic for dashboard widgets
window.FakeDashboard = {
  // Toast notification
  showToast: function(type, message) {
    const toast = document.createElement('div');
    toast.className = `ai-toast ai-toast-${type}`;
    toast.innerHTML = `<span class='ai-toast-icon'>${type==='success' ? '✅' : type==='error' ? '❌' : 'ℹ️'}</span>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 50);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(()=>toast.remove(),400); }, 3500);
  },

  // Fake stats for PnL, Winrate, Copy Profit
  getStats: function() {
    return {
      pnl: 1275.32,
      winrate: 78,
      copyProfit: 462.18,
      portfolio: [
        {symbol: 'BTC', value: 0.19},
        {symbol: 'ETH', value: 1.4},
        {symbol: 'USDT', value: 1200},
        {symbol: 'SOL', value: 10},
        {symbol: 'AVAX', value: 20}
      ],
      portfolioUSD: 3275.32
    };
  },

  // Fake trade history
  getTradeHistory: function() {
    return [
      {date: '2025-05-28', symbol: 'BTC/USDT', side: 'BUY', amount: 0.01, price: 68000, result: '+120$', exchange: 'Binance'},
      {date: '2025-05-28', symbol: 'ETH/USDT', side: 'SELL', amount: 0.2, price: 3900, result: '-20$', exchange: 'OKX'},
      {date: '2025-05-27', symbol: 'SOL/USDT', side: 'BUY', amount: 5, price: 170, result: '+30$', exchange: 'Bybit'},
      {date: '2025-05-27', symbol: 'AVAX/USDT', side: 'SELL', amount: 10, price: 38, result: '+10$', exchange: 'Bitget'},
    ];
  },

  // Fake favorite coins
  getFavorites: function() {
    return ['BTC/USDT','ETH/USDT','SOL/USDT','AVAX/USDT'];
  },

  // Fake AI signals
  getAISignals: function() {
    return [
      {symbol: 'BTC/USDT', type: 'Long', confidence: 91, copyable: true},
      {symbol: 'ETH/USDT', type: 'Short', confidence: 77, copyable: true},
      {symbol: 'SOL/USDT', type: 'Long', confidence: 80, copyable: false},
    ];
  },

  // Fake chart data (for Chart.js)
  getChartData: function(symbol) {
    // 30 fake points
    let labels = Array.from({length: 30}, (_, i) => `T${i}`);
    let data = Array.from({length: 30}, () => Math.round(Math.random()*1000+1000));
    return {labels, data};
  }
};
