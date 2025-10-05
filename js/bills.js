// Bills Management JavaScript
class BillsManager {
    constructor() {
        this.bills = [
            { 
                id: 1, 
                type: 'rent', 
                name: 'إيجار السكن', 
                planned: 2000, 
                actual: 2000, 
                dueDate: '2024-10-01', 
                status: 'paid',
                icon: 'fas fa-home'
            },
            { 
                id: 2, 
                type: 'electricity', 
                name: 'فاتورة الكهرباء', 
                planned: 400, 
                actual: 450, 
                dueDate: '2024-10-15', 
                status: 'pending',
                icon: 'fas fa-bolt'
            },
            { 
                id: 3, 
                type: 'internet', 
                name: 'فاتورة الإنترنت', 
                planned: 300, 
                actual: 280, 
                dueDate: '2024-10-20', 
                status: 'paid',
                icon: 'fas fa-wifi'
            },
            { 
                id: 4, 
                type: 'phone', 
                name: 'فاتورة الهاتف', 
                planned: 150, 
                actual: 165, 
                dueDate: '2024-10-25', 
                status: 'upcoming',
                icon: 'fas fa-phone'
            }
        ];
        this.editingId = null;
        this.init();
    }
    
    init() {
        this.renderTable();
        this.setupEventListeners();
        this.checkOverdueBills();
    }
    
    setupEventListeners() {
        document.getElementById('billForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBill();
        });
        
        document.getElementById('addBillModal').addEventListener('click', (e) => {
            if (e.target.id === 'addBillModal') {
                this.closeAddBillModal();
            }
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('billsTableBody');
        tbody.innerHTML = '';
        
        this.bills.forEach((bill, index) => {
            const row = document.createElement('tr');
            const statusText = this.getStatusText(bill.status);
            const statusClass = bill.status;
            
            row.innerHTML = `
                <td>
                    <i class="${bill.icon}"></i>
                    ${bill.name}
                </td>
                <td>${bill.planned.toLocaleString()} ريال</td>
                <td>${bill.actual.toLocaleString()} ريال</td>
                <td>${this.formatDate(bill.dueDate)}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="billsManager.editBill(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-delete" onclick="billsManager.deleteBill(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    getStatusText(status) {
        const statusTexts = {
            'paid': 'مدفوعة ✅',
            'pending': 'متأخرة ⏳',
            'upcoming': 'قادمة 📅'
        };
        return statusTexts[status] || status;
    }
    
    getBillTypeIcon(type) {
        const icons = {
            'rent': 'fas fa-home',
            'electricity': 'fas fa-bolt',
            'water': 'fas fa-tint',
            'internet': 'fas fa-wifi',
            'phone': 'fas fa-phone',
            'gas': 'fas fa-fire',
            'other': 'fas fa-file-invoice'
        };
        return icons[type] || icons['other'];
    }
    
    getBillTypeName(type) {
        const names = {
            'rent': 'إيجار السكن',
            'electricity': 'فاتورة الكهرباء',
            'water': 'فاتورة المياه',
            'internet': 'فاتورة الإنترنت',
            'phone': 'فاتورة الهاتف',
            'gas': 'فاتورة الغاز',
            'other': 'أخرى'
        };
        return names[type] || names['other'];
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    checkOverdueBills() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.bills.forEach(bill => {
            const dueDate = new Date(bill.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            if (bill.status === 'upcoming' && dueDate < today) {
                bill.status = 'pending';
            }
        });
    }
    
    openAddBillModal() {
        this.editingId = null;
        document.getElementById('billForm').reset();
        document.querySelector('#addBillModal .modal-header h3').textContent = 'إضافة فاتورة جديدة';
        document.getElementById('addBillModal').style.display = 'block';
    }
    
    closeAddBillModal() {
        document.getElementById('addBillModal').style.display = 'none';
    }
    
    editBill(index) {
        this.editingId = index;
        const bill = this.bills[index];
        
        document.getElementById('billType').value = bill.type;
        document.getElementById('plannedBill').value = bill.planned;
        document.getElementById('actualBill').value = bill.actual;
        document.getElementById('dueDate').value = bill.dueDate;
        document.getElementById('billStatus').value = bill.status;
        
        document.querySelector('#addBillModal .modal-header h3').textContent = 'تعديل الفاتورة';
        document.getElementById('addBillModal').style.display = 'block';
    }
    
    deleteBill(index) {
        if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
            this.bills.splice(index, 1);
            this.renderTable();
            this.showNotification('تم حذف الفاتورة بنجاح', 'success');
        }
    }
    
    saveBill() {
        const type = document.getElementById('billType').value;
        const planned = parseFloat(document.getElementById('plannedBill').value);
        const actual = parseFloat(document.getElementById('actualBill').value) || planned;
        const dueDate = document.getElementById('dueDate').value;
        const status = document.getElementById('billStatus').value;
        
        const name = this.getBillTypeName(type);
        const icon = this.getBillTypeIcon(type);
        
        if (this.editingId !== null) {
            this.bills[this.editingId] = {
                ...this.bills[this.editingId],
                type,
                name,
                planned,
                actual,
                dueDate,
                status,
                icon
            };
            this.showNotification('تم تحديث الفاتورة بنجاح', 'success');
        } else {
            const newBill = {
                id: Date.now(),
                type,
                name,
                planned,
                actual,
                dueDate,
                status,
                icon
            };
            this.bills.push(newBill);
            this.showNotification('تم إضافة الفاتورة بنجاح', 'success');
        }
        
        this.renderTable();
        this.closeAddBillModal();
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
let billsManager;

function openAddBillModal() {
    billsManager.openAddBillModal();
}

function closeAddBillModal() {
    billsManager.closeAddBillModal();
}

function editBill(index) {
    billsManager.editBill(index);
}

function deleteBill(index) {
    billsManager.deleteBill(index);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    billsManager = new BillsManager();
});