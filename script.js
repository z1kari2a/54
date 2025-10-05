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
        { type: 'كهرباء', planned: 300, actual: 280, status: 'paid' },
        { type: 'إنترنت', planned: 200, actual: 200, status: 'paid' },
        { type: 'مياه', planned: 100, actual: 0, status: 'overdue' }
    ],
    savings: [
        { type: 'حساب توفير', planned: 2000, actual: 2000 },
        { type: 'استثمار', planned: 1000, actual: 800 },
        { type: 'طوارئ', planned: 500, actual: 500 }
    ]
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    initializeCharts();
    setCurrentMonth();
});

// Set current month
function setCurrentMonth() {
    const now = new Date();
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();
    document.getElementById('current-month').textContent = `${currentMonth} ${currentYear}`;
}

// Update dashboard statistics
function updateDashboard() {
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    
    document.getElementById('total-income').textContent = `${totalIncome.toLocaleString()} ريال`;
    document.getElementById('total-expenses').textContent = `${totalExpenses.toLocaleString()} ريال`;
    document.getElementById('total-bills').textContent = `${totalBills.toLocaleString()} ريال`;
    document.getElementById('total-savings').textContent = `${totalSavings.toLocaleString()} ريال`;
}

// Initialize charts
function initializeCharts() {
    initializeRemainingChart();
    initializeCashFlowChart();
}

// Initialize remaining amount donut chart
function initializeRemainingChart() {
    const ctx = document.getElementById('remainingChart').getContext('2d');
    
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    
    const totalSpent = totalExpenses + totalBills + totalSavings;
    const remaining = totalIncome - totalSpent;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['المتبقي', 'المصروف'],
            datasets: [{
                data: [remaining, totalSpent],
                backgroundColor: [
                    '#4CAF50',
                    '#f44336'
                ],
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toLocaleString() + ' ريال';
                        }
                    }
                }
            }
        }
    });
}

// Initialize cash flow bar chart
function initializeCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart').getContext('2d');
    
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['الدخل', 'المصاريف', 'الفواتير', 'المدخرات'],
            datasets: [{
                label: 'المبلغ (ريال)',
                data: [totalIncome, totalExpenses, totalBills, totalSavings],
                backgroundColor: [
                    '#4CAF50',
                    '#f44336',
                    '#ff9800',
                    '#2196F3'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString() + ' ريال';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' ريال';
                        }
                    }
                }
            }
        }
    });
}

// Utility functions for other pages
function formatCurrency(amount) {
    return amount.toLocaleString() + ' ريال';
}

function getStatusIcon(status) {
    switch(status) {
        case 'paid':
            return '<i class="fas fa-check-circle status-paid"></i> مدفوعة';
        case 'pending':
            return '<i class="fas fa-clock status-pending"></i> في الانتظار';
        case 'overdue':
            return '<i class="fas fa-exclamation-triangle status-overdue"></i> متأخرة';
        default:
            return status;
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