const routes = [
  { href: 'index.html', key: 'dashboard' },
  { href: 'income.html', key: 'income' },
  { href: 'expenses.html', key: 'expenses' },
  { href: 'bills.html', key: 'bills' },
  { href: 'savings.html', key: 'savings' }
];

function setActiveNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const key = path.replace('.html','');
  document.querySelectorAll('[data-nav] a').forEach(a => {
    const akey = a.dataset.key;
    if((key === 'index' && akey === 'dashboard') || akey === key){
      a.classList.add('active');
    }
  });
}

function formatCurrency(value){
  return new Intl.NumberFormat('ar-EG',{ style:'currency', currency:'EGP', maximumFractionDigits:0 }).format(value);
}

function renderKPIs({ income=0, expenses=0, bills=0, savings=0 }){
  const kpis = document.querySelector('[data-kpis]');
  if(!kpis) return;
  const remaining = Math.max(income - (expenses + bills + savings), 0);
  const items = [
    { title:'إجمالي الدخل', value: income },
    { title:'إجمالي المصاريف', value: expenses },
    { title:'إجمالي الفواتير', value: bills },
    { title:'إجمالي المدخرات', value: savings }
  ];
  kpis.innerHTML = items.map(i => (
    `<div class="card"><h4>${i.title}</h4><div class="value">${formatCurrency(i.value)}</div></div>`
  )).join('');
  const remEl = document.querySelector('[data-remaining]');
  if(remEl) remEl.textContent = formatCurrency(remaining);
}

function renderCharts({ income=0, expenses=0, bills=0, savings=0 }){
  if(window.Chart){
    const donutCtx = document.getElementById('donutChart');
    if(donutCtx){
      new Chart(donutCtx,{
        type:'doughnut',
        data:{
          labels:['مصاريف','فواتير','مدخرات','المتبقي'],
          datasets:[{
            data:[expenses,bills,savings, Math.max(income-(expenses+bills+savings),0)],
            backgroundColor:['#ef4444','#f59e0b','#10b981','#2563eb']
          }]
        },
        options:{ plugins:{ legend:{ position:'bottom' } } }
      });
    }
    const barCtx = document.getElementById('barChart');
    if(barCtx){
      new Chart(barCtx,{
        type:'bar',
        data:{
          labels:['الدخل','المصاريف','الفواتير','المدخرات'],
          datasets:[{
            label:'التدفق النقدي',
            data:[income,expenses,bills,savings],
            backgroundColor:['#2563eb','#ef4444','#f59e0b','#10b981']
          }]
        },
        options:{ plugins:{ legend:{ display:false } } }
      });
    }
  }
}

function todayMonthName(){
  return new Date().toLocaleDateString('ar-EG',{ month:'long' });
}

function mountHeader(){
  const header = document.querySelector('[data-header]');
  if(!header) return;
  header.innerHTML = `
    <div class="brand"><span class="logo"></span> Budgetly <span class="month">${todayMonthName()}</span></div>
    <nav class="nav" data-nav>
      <a href="index.html" data-key="dashboard">لوحة التحكم</a>
      <a href="income.html" data-key="income">الدخل</a>
      <a href="expenses.html" data-key="expenses">المصاريف</a>
      <a href="bills.html" data-key="bills">الفواتير</a>
      <a href="savings.html" data-key="savings">المدخرات</a>
    </nav>`;
  setActiveNav();
}

function initDemoData(){
  const demo = { income: 12000, expenses: 4200, bills: 2500, savings: 1500 };
  if(!localStorage.getItem('budget:data')){
    localStorage.setItem('budget:data', JSON.stringify({
      income:[{source:'راتب', planned:12000, actual:12000}],
      expenses:[{category:'أكل', planned:1500, actual:1400}],
      bills:[{type:'إيجار', planned:2000, actual:2000, status:'paid'}],
      savings:[{type:'حساب توفير', planned:1500, actual:1500}]
    }));
  }
  return demo;
}

function sum(arr, key){ return arr.reduce((s,i)=> s + (Number(i[key])||0), 0); }

function loadTotals(){
  const db = JSON.parse(localStorage.getItem('budget:data')||'{}');
  const income = sum(db.income||[], 'actual');
  const expenses = sum(db.expenses||[], 'actual');
  const bills = sum(db.bills||[], 'actual');
  const savings = sum(db.savings||[], 'actual');
  return { income, expenses, bills, savings };
}

function onReady(){
  mountHeader();
  initDemoData();
  const totals = loadTotals();
  renderKPIs(totals);
  renderCharts(totals);
}

document.addEventListener('DOMContentLoaded', onReady);
