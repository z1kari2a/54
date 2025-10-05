// Savings Management JavaScript
class SavingsManager {
    constructor() {
        this.savings = [
            {
                id: 1,
                type: 'savings',
                name: 'حساب التوفير',
                target: 20000,
                current: 15000,
                icon: 'fas fa-university'
            },
            {
                id: 2,
                type: 'investment',
                name: 'استثمار الأسهم',
                target: 10000,
                current: 6500,
                icon: 'fas fa-chart-line'
            },
            {
                id: 3,
                type: 'car',
                name: 'صندوق السيارة',
                target: 50000,
                current: 18000,
                icon: 'fas fa-car'
            }
        ];
        this.editingId = null;
        this.init();
    }
    
    init() {
        this.renderTable();
        this.createProgressChart();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('savingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSaving();
        });
        
        document.getElementById('addSavingModal').addEventListener('click', (e) => {
            if (e.target.id === 'addSavingModal') {
                this.closeAddSavingModal();
            }
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('savingsTableBody');
        tbody.innerHTML = '';
        
        this.savings.forEach((saving, index) => {
            const percentage = Math.round((saving.current / saving.target) * 100);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <i class="${saving.icon}"></i>
                    ${saving.name}
                </td>
                <td>${saving.target.toLocaleString()} ريال</td>
                <td>${saving.current.toLocaleString()} ريال</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="progress-text">${percentage}%</span>
                </td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="savingsManager.editSaving(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-delete" onclick="savingsManager.deleteSaving(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    createProgressChart() {
        const ctx = document.getElementById('savingsProgressChart').getContext('2d');
        
        const labels = this.savings.map(saving => saving.name);
        const currentData = this.savings.map(saving => saving.current);
        const remainingData = this.savings.map(saving => saving.target - saving.current);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'المبلغ المحقق',
                    data: currentData,
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                }, {
                    label: 'المبلغ المتبقي',
                    data: remainingData,
                    backgroundColor: '#e5e7eb',
                    borderColor: '#d1d5db',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            font: { size: 12 }
                        }
                    },
                    y: {
                        stacked: true,
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
                        position: 'top',
                        labels: {
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       context.parsed.y.toLocaleString() + ' ريال';
                            }
                        }
                    }
                }
            }
        });
    }
    
    getSavingTypeIcon(type) {
        const icons = {
            'savings': 'fas fa-university',
            'investment': 'fas fa-chart-line',
            'emergency': 'fas fa-shield-alt',
            'car': 'fas fa-car',
            'house': 'fas fa-home',
            'vacation': 'fas fa-plane',
            'other': 'fas fa-piggy-bank'
        };
        return icons[type] || icons['other'];
    }
    
    getSavingTypeName(type) {
        const names = {
            'savings': 'حساب التوفير',
            'investment': 'استثمار الأسهم',
            'emergency': 'صندوق الطوارئ',
            'car': 'صندوق السيارة',
            'house': 'صندوق المنزل',
            'vacation': 'صندوق العطلة',
            'other': 'أخرى'
        };
        return names[type] || names['other'];
    }
    
    openAddSavingModal() {
        this.editingId = null;
        document.getElementById('savingForm').reset();
        document.querySelector('#addSavingModal .modal-header h3').textContent = 'إضافة مدخر جديد';
        document.getElementById('addSavingModal').style.display = 'block';
    }
    
    closeAddSavingModal() {
        document.getElementById('addSavingModal').style.display = 'none';
    }
    
    editSaving(index) {
        this.editingId = index;
        const saving = this.savings[index];
        
        document.getElementById('savingType').value = saving.type;
        document.getElementById('targetAmount').value = saving.target;
        document.getElementById('currentAmount').value = saving.current;
        
        document.querySelector('#addSavingModal .modal-header h3').textContent = 'تعديل المدخر';
        document.getElementById('addSavingModal').style.display = 'block';
    }
    
    deleteSaving(index) {
        if (confirm('هل أنت متأكد من حذف هذا المدخر؟')) {
            this.savings.splice(index, 1);
            this.renderTable();
            this.updateChart();
            this.showNotification('تم حذف المدخر بنجاح', 'success');
        }
    }
    
    saveSaving() {
        const type = document.getElementById('savingType').value;
        const target = parseFloat(document.getElementById('targetAmount').value);
        const current = parseFloat(document.getElementById('currentAmount').value) || 0;
        
        const name = this.getSavingTypeName(type);
        const icon = this.getSavingTypeIcon(type);
        
        if (this.editingId !== null) {
            this.savings[this.editingId] = {
                ...this.savings[this.editingId],
                type,
                name,
                target,
                current,
                icon
            };
            this.showNotification('تم تحديث المدخر بنجاح', 'success');
        } else {
            const newSaving = {
                id: Date.now(),
                type,
                name,
                target,
                current,
                icon
            };
            this.savings.push(newSaving);
            this.showNotification('تم إضافة المدخر بنجاح', 'success');
        }
        
        this.renderTable();
        this.updateChart();
        this.closeAddSavingModal();
    }
    
    updateChart() {
        // Re-create chart with updated data
        const chartContainer = document.querySelector('#savingsProgressChart').parentNode;
        chartContainer.innerHTML = '<h3>التقدم نحو الأهداف</h3><canvas id="savingsProgressChart"></canvas>';
        this.createProgressChart();
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
let savingsManager;

function openAddSavingModal() {
    savingsManager.openAddSavingModal();
}

function closeAddSavingModal() {
    savingsManager.closeAddSavingModal();
}

function editSaving(index) {
    savingsManager.editSaving(index);
}

function deleteSaving(index) {
    savingsManager.deleteSaving(index);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    savingsManager = new SavingsManager();
});