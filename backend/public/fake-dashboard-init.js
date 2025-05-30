// FAKE DASHBOARD INIT - to be included at end of app.html
window.addEventListener('DOMContentLoaded', function() {
  // Toast örneği
  setTimeout(()=>FakeDashboard.showToast('success','BTC/USDT işlemi başarıyla kopyalandı!'), 1200);

  // Stats
  const stats = FakeDashboard.getStats();
  document.getElementById('fake-pnl').innerText = `$${stats.pnl.toLocaleString()}`;
  document.getElementById('fake-winrate').innerText = `%${stats.winrate}`;
  document.getElementById('fake-copy-profit').innerText = `$${stats.copyProfit}`;
  document.getElementById('fake-portfolio-usd').innerText = `$${stats.portfolioUSD.toLocaleString()}`;

  // Pie Chart
  if(window.Chart) {
    const ctx = document.getElementById('fake-pie-chart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: stats.portfolio.map(x=>x.symbol),
        datasets: [{
          data: stats.portfolio.map(x=>x.value),
          backgroundColor: ['#f3ba2f','#627eea','#26a17b','#ffce45','#e84142']
        }]
      },
      options: {plugins:{legend:{display:false}},responsive:true}
    });
    // Pie legend
    document.getElementById('fake-pie-legend').innerHTML = stats.portfolio.map((x,i)=>`<span><span class='fake-pie-color' style='background:${['#f3ba2f','#627eea','#26a17b','#ffce45','#e84142'][i]}'></span>${x.symbol}</span>`).join('');
  }

  // Favori Coinler
  document.getElementById('fake-fav-coins').innerHTML = FakeDashboard.getFavorites().map(sym=>`<span class='fake-fav-coin'>${sym}</span>`).join('');

  // AI Sinyalleri
  document.getElementById('fake-ai-signals').innerHTML = FakeDashboard.getAISignals().map(sig=>`<div class='fake-ai-signal'><b>${sig.symbol}</b> <span class='conf'>${sig.type} %${sig.confidence}</span> ${sig.copyable ? `<button class='copy-btn'>Kopyala</button>` : ''}</div>`).join('');

  // Mini grafikler (sparkline)
  if(window.Chart) {
    ['btc','eth','sol'].forEach((sym,i)=>{
      const ctx = document.getElementById('fake-sparkline-'+sym).getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: FakeDashboard.getChartData(sym).labels,
          datasets: [{
            data: FakeDashboard.getChartData(sym).data,
            borderColor: ['#f3ba2f','#627eea','#ffce45'][i],
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 2,
            pointRadius: 0
          }]
        },
        options: {plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}},elements:{line:{tension:0.45}},responsive:true}
      });
    });
  }

  // Trade history & filtre
  function renderHistory() {
    const all = FakeDashboard.getTradeHistory();
    let filtered = all;
    const date = document.getElementById('fake-filter-date').value;
    const symbol = document.getElementById('fake-filter-symbol').value;
    const exchange = document.getElementById('fake-filter-exchange').value;
    const result = document.getElementById('fake-filter-result').value;
    if(date) filtered = filtered.filter(x=>x.date===date);
    if(symbol) filtered = filtered.filter(x=>x.symbol===symbol);
    if(exchange) filtered = filtered.filter(x=>x.exchange===exchange);
    if(result) filtered = filtered.filter(x=>result==='pos'?x.result.includes('+'):x.result.includes('-'));
    document.querySelector('#fake-trade-history tbody').innerHTML = filtered.map(x=>`<tr><td>${x.date}</td><td>${x.symbol}</td><td>${x.exchange}</td><td>${x.side}</td><td>${x.amount}</td><td>${x.price}</td><td class='${x.result.includes('+')?'pos':'neg'}'>${x.result}</td></tr>`).join('');
  }
  renderHistory();
  ['fake-filter-date','fake-filter-symbol','fake-filter-exchange','fake-filter-result'].forEach(id=>{
    document.getElementById(id).addEventListener('change',renderHistory);
  });

  // Onboarding gösterimi (ilk girişte)
  if(!localStorage.getItem('ai_dashboard_onboarded')) {
    document.getElementById('fake-onboarding').style.display = 'flex';
    document.getElementById('fake-onboarding').querySelector('button').onclick = function(){
      document.getElementById('fake-onboarding').style.display = 'none';
      localStorage.setItem('ai_dashboard_onboarded','1');
    };
  }

  // Support chat
  window.FakeDashboard.sendSupportMessage = function() {
    const input = document.getElementById('fake-support-input');
    const body = document.getElementById('fake-support-chat-body');
    if(input.value.trim()){
      body.innerHTML += `<div><b>Sen:</b> ${input.value}</div>`;
      setTimeout(()=>{body.innerHTML += `<div><b>AI Destek:</b> Sorunuz kaydedildi, en kısa sürede dönüş yapılacaktır.</div>`; body.scrollTop = body.scrollHeight;}, 800);
      input.value='';
      body.scrollTop = body.scrollHeight;
    }
  };
});
