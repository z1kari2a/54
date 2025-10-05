// بيانات تجريبية للميزانية
let budgetData = {
    income: [
        { source: 'راتب شهري', planned: 5000, actual: 5000 },
        { source: 'دخل إضافي', planned: 1000, actual: 800 }
    ],
    expenses: [
        { category: 'أكل وشرب', planned: 1500, actual: 1400 },
        { category: 'مواصلات', planned: 500, actual: 600 },
        { category: 'تسلية', planned: 300, actual: 450 }
    ],
    bills: [
        { type: 'إيجار الشقة', planned: 2500, actual: 2500, dueDate: '2024-09-01', status: 'paid' },
        { type: 'فاتورة الكهرباء', planned: 200, actual: 0, dueDate: '2024-09-15', status: 'pending' },
        { type: 'فاتورة الإنترنت', planned: 150, actual: 0, dueDate: '2024-08-25', status: 'overdue' },
        { type: 'فاتورة الهاتف', planned: 100, actual: 100, dueDate: '2024-09-10', status: 'paid' }
    ],
    savings: [
        { type: 'حساب التوفير', goal: 10000, current: 7500 },
        { type: 'شراء سيارة', goal: 50000, current: 15000 },
        { type: 'طوارئ', goal: 15000, current: 12000 }
    ]
};

// دوال عامة للحسابات
function calculateTotals() {
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.current, 0);
    
    return { totalIncome, totalExpenses, totalBills, totalSavings };
}

function updateDashboard() {
    const totals = calculateTotals();
    
    document.getElementById('totalIncome').textContent = totals.totalIncome.toLocaleString() + ' ريال';
    document.getElementById('totalExpenses').textContent = totals.totalExpenses.toLocaleString() + ' ريال';
    document.getElementById('totalBills').textContent = totals.totalBills.toLocaleString() + ' ريال';
    document.getElementById('totalSavings').textContent = totals.totalSavings.toLocaleString() + ' ريال';
    
    // تحديث الرسوم البيانية
    updateRemainingChart();
    updateCashFlowChart();
}

function updateRemainingChart() {
    const totals = calculateTotals();
    const totalIncome = totals.totalIncome;
    const totalSpent = totals.totalExpenses + totals.totalBills;
    const remaining = Math.max(0, totalIncome - totalSpent);
    
    const ctx = document.getElementById('remainingChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['المبلغ المتبقي', 'المبلغ المصروف'],
            datasets: [{
                data: [remaining, totalSpent],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true
                }
            }
        }
    });
}

function updateCashFlowChart() {
    const totals = calculateTotals();
    
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['الدخل', 'المصاريف', 'الفواتير', 'المدخرات'],
            datasets: [{
                label: 'المبالغ (ريال)',
                data: [totals.totalIncome, totals.totalExpenses, totals.totalBills, totals.totalSavings],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateExpensesChart() {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    
    const categories = budgetData.expenses.map(exp => exp.category);
    const amounts = budgetData.expenses.map(exp => exp.actual);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true
                }
            }
        }
    });
}

function updateSavingsChart() {
    const ctx = document.getElementById('savingsProgressChart');
    if (!ctx) return;
    
    const savingsGoals = budgetData.savings.map(saving => ({
        label: saving.type,
        current: saving.current,
        goal: saving.goal,
        percentage: Math.round((saving.current / saving.goal) * 100)
    }));
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: savingsGoals.map(s => s.label),
            datasets: [{
                label: 'المبلغ الحالي',
                data: savingsGoals.map(s => s.current),
                backgroundColor: '#17a2b8',
                borderRadius: 8
            }, {
                label: 'الهدف',
                data: savingsGoals.map(s => s.goal),
                backgroundColor: '#e9ecef',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// دوال النوافذ المنبثقة
function showAddIncomeModal() {
    document.getElementById('addIncomeModal').style.display = 'block';
}

function hideAddIncomeModal() {
    document.getElementById('addIncomeModal').style.display = 'none';
    document.getElementById('addIncomeForm').reset();
}

function showAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'block';
}

function hideAddExpenseModal() {
    document.getElementById('addExpenseModal').style.display = 'none';
    document.getElementById('addExpenseForm').reset();
}

function showAddSavingModal() {
    document.getElementById('addSavingModal').style.display = 'block';
}

function hideAddSavingModal() {
    document.getElementById('addSavingModal').style.display = 'none';
    document.getElementById('addSavingForm').reset();
}

// دوال إدارة البيانات
function addIncome(form) {
    const source = document.getElementById('incomeSource').value;
    const planned = parseFloat(document.getElementById('plannedAmount').value);
    const actual = parseFloat(document.getElementById('actualAmount').value);
    
    budgetData.income.push({ source, planned, actual });
    updateIncomeTable();
    hideAddIncomeModal();
    updateDashboard();
    
    return false;
}

function addExpense(form) {
    const category = document.getElementById('expenseCategory').value;
    const planned = parseFloat(document.getElementById('expensePlanned').value);
    const actual = parseFloat(document.getElementById('expenseActual').value);
    
    const categoryNames = {
        'food': 'أكل وشرب',
        'transport': 'مواصلات',
        'entertainment': 'تسلية',
        'shopping': 'تسوق',
        'health': 'صحة',
        'education': 'تعليم',
        'other': 'أخرى'
    };
    
    budgetData.expenses.push({ 
        category: categoryNames[category], 
        planned, 
        actual 
    });
    updateExpensesTable();
    updateExpensesChart();
    hideAddExpenseModal();
    updateDashboard();
    
    return false;
}

function addSaving(form) {
    const type = document.getElementById('savingType').value;
    const goal = parseFloat(document.getElementById('savingGoal').value);
    const current = parseFloat(document.getElementById('savingCurrent').value);
    
    budgetData.savings.push({ type, goal, current });
    updateSavingsTable();
    updateSavingsChart();
    hideAddSavingModal();
    updateDashboard();
    
    return false;
}

// دوال تحديث الجداول
function updateIncomeTable() {
    const tbody = document.getElementById('incomeTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    budgetData.income.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.source}</td>
            <td>${item.planned.toLocaleString()} ريال</td>
            <td>${item.actual.toLocaleString()} ريال</td>
            <td><span class="status-${item.actual >= item.planned ? 'complete' : 'pending'}">
                ${item.actual >= item.planned ? 'مكتمل' : 'جاري'}
            </span></td>
            <td>
                <button class="btn-edit" onclick="editIncome(${index})">تعديل</button>
                <button class="btn-delete" onclick="deleteIncome(${index})">حذف</button>
            </td>
        `;
    });
}

function updateExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    budgetData.expenses.forEach((item, index) => {
        const percentage = Math.round((item.actual / item.planned) * 100);
        let status = 'good';
        if (percentage > 100) status = 'danger';
        else if (percentage > 80) status = 'warning';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.planned.toLocaleString()} ريال</td>
            <td>${item.actual.toLocaleString()} ريال</td>
            <td>${percentage}%</td>
            <td><span class="status-${status}">${getStatusText(status)}</span></td>
            <td>
                <button class="btn-edit" onclick="editExpense(${index})">تعديل</button>
                <button class="btn-delete" onclick="deleteExpense(${index})">حذف</button>
            </td>
        `;
    });
}

function updateBillsTable(filter = 'all') {
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    budgetData.bills
        .filter(bill => filter === 'all' || bill.status === filter)
        .forEach((bill, index) => {
            const row = tbody.insertRow();
            const originalIndex = budgetData.bills.indexOf(bill);
            row.className = `bill-${bill.status}`;
            
            row.innerHTML = `
                <td>${bill.type}</td>
                <td>${bill.planned.toLocaleString()} ريال</td>
                <td>${bill.actual.toLocaleString()} ريال</td>
                <td>${bill.dueDate}</td>
                <td><span class="status-${bill.status}">${getBillStatusText(bill.status)}</span></td>
                <td>
                    ${bill.status !== 'paid' ? `<button class="btn-pay ${bill.status === 'overdue' ? 'urgent' : ''}" onclick="markAsPaid(${originalIndex})">دفع${bill.status === 'overdue' ? ' عاجل' : ''}</button>` : ''}
                    <button class="btn-edit" onclick="editBill(${originalIndex})">تعديل</button>
                    <button class="btn-delete" onclick="deleteBill(${originalIndex})">حذف</button>
                </td>
            `;
        });
}

function updateSavingsTable() {
    const tbody = document.getElementById('savingsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    budgetData.savings.forEach((item, index) => {
        const percentage = Math.round((item.current / item.goal) * 100);
        let status = percentage >= 80 ? 'good' : 'pending';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${item.goal.toLocaleString()} ريال</td>
            <td>${item.current.toLocaleString()} ريال</td>
            <td>${percentage}%</td>
            <td><span class="status-${status}">${getStatusText(status)}</span></td>
            <td>
                <button class="btn-edit" onclick="editSaving(${index})">تعديل</button>
                <button class="btn-delete" onclick="deleteSaving(${index})">حذف</button>
            </td>
        `;
    });
}

// دوال مساعدة للحالات
function getStatusText(status) {
    const statusMap = {
        'good': 'جيد',
        'warning': 'تحذير',
        'danger': 'تجاوز',
        'pending': 'في الطريق',
        'complete': 'مكتمل'
    };
    return statusMap[status] || status;
}

function getBillStatusText(status) {
    const statusMap = {
        'paid': 'مدفوعة ✅',
        'pending': 'معلقة ⏳',
        'overdue': 'متأخرة ⚠️'
    };
    return statusMap[status] || status;
}

// دوال التعديل والحذف
function editIncome(index) {
    alert('وظيفة التعديل قيد التطوير');
}

function deleteIncome(index) {
    if (confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
        budgetData.income.splice(index, 1);
        updateIncomeTable();
        updateDashboard();
    }
}

function editExpense(index) {
    alert('وظيفة التعديل قيد التطوير');
}

function deleteExpense(index) {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
        budgetData.expenses.splice(index, 1);
        updateExpensesTable();
        updateExpensesChart();
        updateDashboard();
    }
}

function editBill(index) {
    alert('وظيفة التعديل قيد التطوير');
}

function deleteBill(index) {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        budgetData.bills.splice(index, 1);
        updateBillsTable();
        updateDashboard();
    }
}

function markAsPaid(index) {
    budgetData.bills[index].status = 'paid';
    budgetData.bills[index].actual = budgetData.bills[index].planned;
    updateBillsTable();
    updateDashboard();
}

function editSaving(index) {
    alert('وظيفة التعديل قيد التطوير');
}

function deleteSaving(index) {
    if (confirm('هل أنت متأكد من حذف هذا الهدف؟')) {
        budgetData.savings.splice(index, 1);
        updateSavingsTable();
        updateSavingsChart();
        updateDashboard();
    }
}

function filterBills(status) {
    // تحديث أزرار الفلتر
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // تحديث الجدول
    updateBillsTable(status);
}

// إعداد النماذج
document.getElementById('addIncomeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    addIncome(this);
});

document.getElementById('addExpenseForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    addExpense(this);
});

document.getElementById('addSavingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    addSaving(this);
});

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة لوحة التحكم
    if (document.querySelector('.stats-grid')) {
        updateDashboard();
    }
    
    // تهيئة صفحة المصاريف
    if (document.getElementById('expensesChart')) {
        updateExpensesChart();
        updateExpensesTable();
    }
    
    // تهيئة صفحة الفواتير
    if (document.getElementById('billsTableBody')) {
        updateBillsTable();
    }
    
    // تهيئة صفحة المدخرات
    if (document.getElementById('savingsProgressChart')) {
        updateSavingsChart();
        updateSavingsTable();
    }
    
    // إغلاق النوافذ عند النقر خارجها
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});