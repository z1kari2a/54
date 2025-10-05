// Bills page specific functions
document.addEventListener('DOMContentLoaded', function() {
    setCurrentMonth();
    loadBillsData();
    setupBillsForm();
    updateBillsSummary();
});

// Load bills data into table
function loadBillsData() {
    const tbody = document.getElementById('billsTableBody');
    tbody.innerHTML = '';
    
    budgetData.bills.forEach((item, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td>${getStatusIcon(item.status)}</td>
            <td>
                <button class="btn" onclick="toggleBillStatus(${index})" style="padding: 0.5rem; font-size: 0.8rem;">
                    <i class="fas fa-toggle-on"></i>
                </button>
                <button class="btn" onclick="editBill(${index})" style="padding: 0.5rem; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="deleteBill(${index})" style="padding: 0.5rem; font-size: 0.8rem; background: #f44336;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateBillsSummary();
}

// Update bills summary cards
function updateBillsSummary() {
    const paidCount = budgetData.bills.filter(bill => bill.status === 'paid').length;
    const pendingCount = budgetData.bills.filter(bill => bill.status === 'pending').length;
    const overdueCount = budgetData.bills.filter(bill => bill.status === 'overdue').length;
    
    document.getElementById('paid-bills').textContent = paidCount;
    document.getElementById('pending-bills').textContent = pendingCount;
    document.getElementById('overdue-bills').textContent = overdueCount;
}

// Setup bills form
function setupBillsForm() {
    const form = document.getElementById('addBillForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('billType').value;
        const planned = parseFloat(document.getElementById('billPlanned').value);
        const actual = parseFloat(document.getElementById('billActual').value);
        const status = document.getElementById('billStatus').value;
        
        // Add new bill
        budgetData.bills.push({
            type: type,
            planned: planned,
            actual: actual,
            status: status
        });
        
        // Reload table and summary
        loadBillsData();
        
        // Close modal and reset form
        closeModal('addBillModal');
        form.reset();
        
        // Show success message
        alert('تم إضافة الفاتورة بنجاح!');
    });
}

// Toggle bill status
function toggleBillStatus(index) {
    const bill = budgetData.bills[index];
    
    switch(bill.status) {
        case 'paid':
            bill.status = 'pending';
            break;
        case 'pending':
            bill.status = 'overdue';
            break;
        case 'overdue':
            bill.status = 'paid';
            break;
    }
    
    loadBillsData();
    alert('تم تحديث حالة الفاتورة!');
}

// Edit bill item
function editBill(index) {
    const item = budgetData.bills[index];
    
    const newType = prompt('نوع الفاتورة:', item.type);
    if (newType === null) return;
    
    const newPlanned = prompt('المبلغ المخطط:', item.planned);
    if (newPlanned === null) return;
    
    const newActual = prompt('المبلغ الفعلي:', item.actual);
    if (newActual === null) return;
    
    const statusOptions = ['paid', 'pending', 'overdue'];
    const statusLabels = ['مدفوعة', 'في الانتظار', 'متأخرة'];
    const currentStatusIndex = statusOptions.indexOf(item.status);
    
    const newStatus = prompt(`الحالة (1-مدفوعة, 2-في الانتظار, 3-متأخرة):`, currentStatusIndex + 1);
    if (newStatus === null) return;
    
    const statusIndex = parseInt(newStatus) - 1;
    if (statusIndex < 0 || statusIndex >= statusOptions.length) {
        alert('رقم الحالة غير صحيح');
        return;
    }
    
    budgetData.bills[index] = {
        type: newType,
        planned: parseFloat(newPlanned),
        actual: parseFloat(newActual),
        status: statusOptions[statusIndex]
    };
    
    loadBillsData();
    alert('تم تحديث الفاتورة بنجاح!');
}

// Delete bill item
function deleteBill(index) {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        budgetData.bills.splice(index, 1);
        loadBillsData();
        alert('تم حذف الفاتورة بنجاح!');
    }
}