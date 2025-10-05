// Income Management JavaScript
class IncomeManager {
    constructor() {
        this.incomes = [
            { id: 1, source: 'الراتب الأساسي', planned: 10000, actual: 10000 },
            { id: 2, source: 'أعمال إضافية', planned: 3000, actual: 2500 },
            { id: 3, source: 'استثمارات', planned: 2000, actual: 2500 }
        ];
        this.editingId = null;
        this.init();
    }
    
    init() {
        this.renderTable();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('incomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveIncome();
        });
        
        // Close modal when clicking outside
        document.getElementById('addIncomeModal').addEventListener('click', (e) => {
            if (e.target.id === 'addIncomeModal') {
                this.closeAddIncomeModal();
            }
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('incomeTableBody');
        tbody.innerHTML = '';
        
        this.incomes.forEach((income, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${income.source}</td>
                <td>${income.planned.toLocaleString()} ريال</td>
                <td>${income.actual.toLocaleString()} ريال</td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="incomeManager.editIncome(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-delete" onclick="incomeManager.deleteIncome(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    openAddIncomeModal() {
        this.editingId = null;
        document.getElementById('incomeForm').reset();
        document.querySelector('#addIncomeModal .modal-header h3').textContent = 'إضافة مصدر دخل جديد';
        document.getElementById('addIncomeModal').style.display = 'block';
    }
    
    closeAddIncomeModal() {
        document.getElementById('addIncomeModal').style.display = 'none';
    }
    
    editIncome(index) {
        this.editingId = index;
        const income = this.incomes[index];
        
        document.getElementById('incomeSource').value = income.source;
        document.getElementById('plannedIncome').value = income.planned;
        document.getElementById('actualIncome').value = income.actual;
        
        document.querySelector('#addIncomeModal .modal-header h3').textContent = 'تعديل مصدر الدخل';
        document.getElementById('addIncomeModal').style.display = 'block';
    }
    
    deleteIncome(index) {
        if (confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
            this.incomes.splice(index, 1);
            this.renderTable();
            this.showNotification('تم حذف مصدر الدخل بنجاح', 'success');
        }
    }
    
    saveIncome() {
        const source = document.getElementById('incomeSource').value;
        const planned = parseFloat(document.getElementById('plannedIncome').value);
        const actual = parseFloat(document.getElementById('actualIncome').value) || planned;
        
        if (this.editingId !== null) {
            // Update existing income
            this.incomes[this.editingId] = {
                ...this.incomes[this.editingId],
                source,
                planned,
                actual
            };
            this.showNotification('تم تحديث مصدر الدخل بنجاح', 'success');
        } else {
            // Add new income
            const newIncome = {
                id: Date.now(),
                source,
                planned,
                actual
            };
            this.incomes.push(newIncome);
            this.showNotification('تم إضافة مصدر الدخل بنجاح', 'success');
        }
        
        this.renderTable();
        this.closeAddIncomeModal();
    }
    
    showNotification(message, type = 'info') {
        // Simple notification system
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

// Global functions for HTML onclick handlers
let incomeManager;

function openAddIncomeModal() {
    incomeManager.openAddIncomeModal();
}

function closeAddIncomeModal() {
    incomeManager.closeAddIncomeModal();
}

function editIncome(index) {
    incomeManager.editIncome(index);
}

function deleteIncome(index) {
    incomeManager.deleteIncome(index);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    incomeManager = new IncomeManager();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});