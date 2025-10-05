// Global data storage
let budgetData = {
    income: [
        { source: 'الراتب', planned: 12000, actual: 12000 },
        { source: 'عمل إضافي', planned: 2000, actual: 1500 },
        { source: 'استثمارات', planned: 1000, actual: 1500 }
    ],
    expenses: [
        { category: 'طعام', planned: 2000, actual: 1800 },
        { category: 'مواصلات', planned: 800, actual: 750 },
        { category: 'تسلية', planned: 500, actual: 600 },
        { category: 'صحة', planned: 300, actual: 250 }
    ],
    bills: [
        { type: 'إيجار', planned: 2000, actual: 2000, status: 'paid' },
        { type: 'كهرباء', planned: 400, actual: 450, status: 'paid' },
        { type: 'إنترنت', planned: 200, actual: 200, status: 'paid' },
        { type: 'مياه', planned: 150, actual: 0, status: 'overdue' }
    ],
    savings: [
        { type: 'حساب توفير', planned: 2000, actual: 2000, goal: 5000 },
        { type: 'استثمار', planned: 1000, actual: 1000, goal: 10000 },
        { type: 'طوارئ', planned: 500, actual: 300, goal: 2000 }
    ]
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    initializeCharts();
    updateCurrentMonth();
});

// Update current month display
function updateCurrentMonth() {
    const now = new Date();
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();
    document.getElementById('current-month').textContent = `${currentMonth} ${currentYear}`;
}

// Calculate and update statistics
function updateStats() {
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    
    document.getElementById('total-income').textContent = `${totalIncome.toLocaleString()} ريال`;
    document.getElementById('total-expenses').textContent = `${totalExpenses.toLocaleString()} ريال`;
    document.getElementById('total-bills').textContent = `${totalBills.toLocaleString()} ريال`;
    document.getElementById('total-savings').textContent = `${totalSavings.toLocaleString()} ريال`;
    
    const remaining = totalIncome - totalExpenses - totalBills - totalSavings;
    document.getElementById('remaining-amount').textContent = `${remaining.toLocaleString()} ريال`;
    
    return { totalIncome, totalExpenses, totalBills, totalSavings, remaining };
}

// Initialize charts
function initializeCharts() {
    const stats = updateStats();
    
    // Remaining Amount Donut Chart
    const remainingCtx = document.getElementById('remainingChart').getContext('2d');
    new Chart(remainingCtx, {
        type: 'doughnut',
        data: {
            labels: ['متبقي', 'مصروف'],
            datasets: [{
                data: [stats.remaining, stats.totalIncome - stats.remaining],
                backgroundColor: ['#4CAF50', '#E0E0E0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
    
    // Cash Flow Bar Chart
    const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d');
    new Chart(cashFlowCtx, {
        type: 'bar',
        data: {
            labels: ['الدخل', 'المصاريف', 'الفواتير', 'المدخرات'],
            datasets: [{
                label: 'المبلغ (ريال)',
                data: [stats.totalIncome, stats.totalExpenses, stats.totalBills, stats.totalSavings],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(33, 150, 243, 0.8)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(33, 150, 243, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' ريال';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Utility functions for other pages
function formatCurrency(amount) {
    return amount.toLocaleString() + ' ريال';
}

function getStatusClass(status) {
    switch(status) {
        case 'paid': return 'status paid';
        case 'pending': return 'status pending';
        case 'overdue': return 'status overdue';
        default: return 'status';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'paid': return 'مدفوعة';
        case 'pending': return 'معلقة';
        case 'overdue': return 'متأخرة';
        default: return 'غير محدد';
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#f44336';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Add new item functions
function addIncomeItem() {
    if (!validateForm('incomeForm')) return;
    
    const form = document.getElementById('incomeForm');
    const formData = new FormData(form);
    
    const newItem = {
        source: formData.get('source'),
        planned: parseFloat(formData.get('planned')),
        actual: parseFloat(formData.get('actual'))
    };
    
    budgetData.income.push(newItem);
    updateIncomeTable();
    closeModal('incomeModal');
    form.reset();
}

function addExpenseItem() {
    if (!validateForm('expenseForm')) return;
    
    const form = document.getElementById('expenseForm');
    const formData = new FormData(form);
    
    const newItem = {
        category: formData.get('category'),
        planned: parseFloat(formData.get('planned')),
        actual: parseFloat(formData.get('actual'))
    };
    
    budgetData.expenses.push(newItem);
    updateExpenseTable();
    closeModal('expenseModal');
    form.reset();
}

function addBillItem() {
    if (!validateForm('billForm')) return;
    
    const form = document.getElementById('billForm');
    const formData = new FormData(form);
    
    const newItem = {
        type: formData.get('type'),
        planned: parseFloat(formData.get('planned')),
        actual: parseFloat(formData.get('actual')),
        status: formData.get('status')
    };
    
    budgetData.bills.push(newItem);
    updateBillTable();
    closeModal('billModal');
    form.reset();
}

function addSavingsItem() {
    if (!validateForm('savingsForm')) return;
    
    const form = document.getElementById('savingsForm');
    const formData = new FormData(form);
    
    const newItem = {
        type: formData.get('type'),
        planned: parseFloat(formData.get('planned')),
        actual: parseFloat(formData.get('actual')),
        goal: parseFloat(formData.get('goal'))
    };
    
    budgetData.savings.push(newItem);
    updateSavingsTable();
    closeModal('savingsModal');
    form.reset();
}

// Table update functions
function updateIncomeTable() {
    const tbody = document.querySelector('#incomeTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    budgetData.income.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.source}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
        `;
    });
}

function updateExpenseTable() {
    const tbody = document.querySelector('#expenseTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    budgetData.expenses.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
        `;
    });
}

function updateBillTable() {
    const tbody = document.querySelector('#billTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    budgetData.bills.forEach(item => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td><span class="${getStatusClass(item.status)}">${getStatusText(item.status)}</span></td>
        `;
    });
}

function updateSavingsTable() {
    const tbody = document.querySelector('#savingsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    budgetData.savings.forEach(item => {
        const progress = (item.actual / item.goal) * 100;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td>${formatCurrency(item.goal)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <small>${progress.toFixed(1)}%</small>
            </td>
        `;
    });
}