// Expenses Management JavaScript
class ExpensesManager {
    constructor() {
        this.expenses = [
            { id: 1, category: 'food', name: 'أكل وشراب', planned: 2500, actual: 2800, icon: 'fas fa-utensils' },
            { id: 2, category: 'transport', name: 'مواصلات', planned: 1500, actual: 1200, icon: 'fas fa-car' },
            { id: 3, category: 'entertainment', name: 'تسلية', planned: 1000, actual: 1300, icon: 'fas fa-gamepad' },
            { id: 4, category: 'clothing', name: 'ملابس', planned: 800, actual: 600, icon: 'fas fa-tshirt' }
        ];
        this.editingId = null;
        this.init();
    }
    
    init() {
        this.renderTable();
        this.createExpensesChart();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExpense();
        });
        
        document.getElementById('addExpenseModal').addEventListener('click', (e) => {
            if (e.target.id === 'addExpenseModal') {
                this.closeAddExpenseModal();
            }
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('expensesTableBody');
        tbody.innerHTML = '';
        
        this.expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <i class="${expense.icon}"></i>
                    ${expense.name}
                </td>
                <td>${expense.planned.toLocaleString()} ريال</td>
                <td>${expense.actual.toLocaleString()} ريال</td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="expensesManager.editExpense(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-delete" onclick="expensesManager.deleteExpense(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    createExpensesChart() {
        const ctx = document.getElementById('expensesChart').getContext('2d');
        
        const labels = this.expenses.map(exp => exp.name);
        const actualData = this.expenses.map(exp => exp.actual);
        const plannedData = this.expenses.map(exp => exp.planned);
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: actualData,
                    backgroundColor: [
                        '#10b981',
                        '#f97316', 
                        '#3b82f6',
                        '#eab308',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString()} ريال (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    getCategoryIcon(category) {
        const icons = {
            'food': 'fas fa-utensils',
            'transport': 'fas fa-car',
            'entertainment': 'fas fa-gamepad',
            'clothing': 'fas fa-tshirt',
            'healthcare': 'fas fa-heartbeat',
            'other': 'fas fa-shopping-cart'
        };
        return icons[category] || icons['other'];
    }
    
    getCategoryName(category) {
        const names = {
            'food': 'أكل وشراب',
            'transport': 'مواصلات',
            'entertainment': 'تسلية',
            'clothing': 'ملابس',
            'healthcare': 'رعاية صحية',
            'other': 'أخرى'
        };
        return names[category] || names['other'];
    }
    
    openAddExpenseModal() {
        this.editingId = null;
        document.getElementById('expenseForm').reset();
        document.querySelector('#addExpenseModal .modal-header h3').textContent = 'إضافة مصروف جديد';
        document.getElementById('addExpenseModal').style.display = 'block';
    }
    
    closeAddExpenseModal() {
        document.getElementById('addExpenseModal').style.display = 'none';
    }
    
    editExpense(index) {
        this.editingId = index;
        const expense = this.expenses[index];
        
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('plannedExpense').value = expense.planned;
        document.getElementById('actualExpense').value = expense.actual;
        
        document.querySelector('#addExpenseModal .modal-header h3').textContent = 'تعديل المصروف';
        document.getElementById('addExpenseModal').style.display = 'block';
    }
    
    deleteExpense(index) {
        if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
            this.expenses.splice(index, 1);
            this.renderTable();
            this.updateChart();
            this.showNotification('تم حذف المصروف بنجاح', 'success');
        }
    }
    
    saveExpense() {
        const category = document.getElementById('expenseCategory').value;
        const planned = parseFloat(document.getElementById('plannedExpense').value);
        const actual = parseFloat(document.getElementById('actualExpense').value) || planned;
        
        const name = this.getCategoryName(category);
        const icon = this.getCategoryIcon(category);
        
        if (this.editingId !== null) {
            this.expenses[this.editingId] = {
                ...this.expenses[this.editingId],
                category,
                name,
                planned,
                actual,
                icon
            };
            this.showNotification('تم تحديث المصروف بنجاح', 'success');
        } else {
            const newExpense = {
                id: Date.now(),
                category,
                name,
                planned,
                actual,
                icon
            };
            this.expenses.push(newExpense);
            this.showNotification('تم إضافة المصروف بنجاح', 'success');
        }
        
        this.renderTable();
        this.updateChart();
        this.closeAddExpenseModal();
    }
    
    updateChart() {
        // Re-create chart with updated data
        const chartContainer = document.querySelector('#expensesChart').parentNode;
        chartContainer.innerHTML = '<canvas id="expensesChart"></canvas>';
        this.createExpensesChart();
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions
let expensesManager;

function openAddExpenseModal() {
    expensesManager.openAddExpenseModal();
}

function closeAddExpenseModal() {
    expensesManager.closeAddExpenseModal();
}

function editExpense(index) {
    expensesManager.editExpense(index);
}

function deleteExpense(index) {
    expensesManager.deleteExpense(index);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    expensesManager = new ExpensesManager();
});