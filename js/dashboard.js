// Dashboard JavaScript
class BudgetDashboard {
    constructor() {
        this.data = {
            income: { planned: 15000, actual: 15000 },
            expenses: { planned: 7700, actual: 8500 },
            bills: { planned: 2850, actual: 3200 },
            savings: { planned: 4450, actual: 3300 }
        };
        
        this.init();
    }
    
    init() {
        this.updateStats();
        this.createRemainingBudgetChart();
        this.createCashFlowChart();
    }
    
    updateStats() {
        document.getElementById('totalIncome').textContent = `${this.data.income.actual.toLocaleString()} ريال`;
        document.getElementById('totalExpenses').textContent = `${this.data.expenses.actual.toLocaleString()} ريال`;
        document.getElementById('totalBills').textContent = `${this.data.bills.actual.toLocaleString()} ريال`;
        document.getElementById('totalSavings').textContent = `${this.data.savings.actual.toLocaleString()} ريال`;
    }
    
    createRemainingBudgetChart() {
        const ctx = document.getElementById('remainingBudgetChart').getContext('2d');
        const totalSpent = this.data.expenses.actual + this.data.bills.actual + this.data.savings.actual;
        const remaining = this.data.income.actual - totalSpent;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['المصروف', 'المتبقي'],
                datasets: [{
                    data: [totalSpent, remaining],
                    backgroundColor: ['#f97316', '#10b981'],
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
                            font: { size: 14 },
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
    
    createCashFlowChart() {
        const ctx = document.getElementById('cashFlowChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['الدخل', 'المصاريف', 'الفواتير', 'المدخرات'],
                datasets: [{
                    label: 'المخطط',
                    data: [
                        this.data.income.planned,
                        -this.data.expenses.planned,
                        -this.data.bills.planned,
                        -this.data.savings.planned
                    ],
                    backgroundColor: '#dbeafe',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }, {
                    label: 'الفعلي',
                    data: [
                        this.data.income.actual,
                        -this.data.expenses.actual,
                        -this.data.bills.actual,
                        -this.data.savings.actual
                    ],
                    backgroundColor: ['#10b981', '#f97316', '#ef4444', '#3b82f6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 14 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Math.abs(value).toLocaleString() + ' ريال';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    new BudgetDashboard();
});