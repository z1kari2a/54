// ===== Data Storage =====
let budgetData = {
    income: [],
    expenses: [],
    bills: [],
    savings: []
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('budgetData');
    if (saved) {
        budgetData = JSON.parse(saved);
    } else {
        // Initialize with sample data
        budgetData = {
            income: [
                { id: 1, source: 'الراتب', planned: 15000, actual: 15000 },
                { id: 2, source: 'عمل إضافي', planned: 3000, actual: 2500 }
            ],
            expenses: [
                { id: 1, category: 'أكل', planned: 3000, actual: 2800 },
                { id: 2, category: 'مواصلات', planned: 1500, actual: 1600 },
                { id: 3, category: 'تسلية', planned: 1000, actual: 900 }
            ],
            bills: [
                { id: 1, type: 'إيجار', planned: 5000, actual: 5000, status: 'مدفوعة' },
                { id: 2, type: 'كهرباء', planned: 500, actual: 550, status: 'مدفوعة' },
                { id: 3, type: 'إنترنت', planned: 300, actual: 300, status: 'متأخرة' }
            ],
            savings: [
                { id: 1, type: 'حساب توفير', planned: 5000, actual: 3500 },
                { id: 2, type: 'صندوق طوارئ', planned: 10000, actual: 7000 }
            ]
        };
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
}

// ===== Dashboard Functions =====
function updateDashboard() {
    // Calculate totals
    const totalIncome = budgetData.income.reduce((sum, item) => sum + item.actual, 0);
    const totalExpenses = budgetData.expenses.reduce((sum, item) => sum + item.actual, 0);
    const totalBills = budgetData.bills.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    
    // Update cards
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('total-bills').textContent = formatCurrency(totalBills);
    document.getElementById('total-savings').textContent = formatCurrency(totalSavings);
    
    // Calculate remaining amount
    const remaining = totalIncome - totalExpenses - totalBills - totalSavings;
    document.getElementById('remaining-amount').textContent = formatCurrency(remaining);
    
    // Create remaining amount donut chart
    createRemainingChart(totalIncome, totalExpenses + totalBills + totalSavings);
    
    // Create cash flow bar chart
    createCashFlowChart(totalIncome, totalExpenses, totalBills, totalSavings);
}

function createRemainingChart(income, spent) {
    const ctx = document.getElementById('remainingChart');
    if (!ctx) return;
    
    const remaining = income - spent;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['المصروف', 'المتبقي'],
            datasets: [{
                data: [spent, remaining],
                backgroundColor: ['#ef4444', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createCashFlowChart(income, expenses, bills, savings) {
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['الدخل', 'المصاريف', 'الفواتير', 'المدخرات'],
            datasets: [{
                label: 'المبلغ (ريال)',
                data: [income, expenses, bills, savings],
                backgroundColor: ['#10b981', '#ef4444', '#f97316', '#3b82f6'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===== Income Page Functions =====
function updateIncomeTable() {
    const tbody = document.getElementById('income-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let plannedTotal = 0;
    let actualTotal = 0;
    
    budgetData.income.forEach(item => {
        const difference = item.actual - item.planned;
        plannedTotal += item.planned;
        actualTotal += item.actual;
        
        const row = `
            <tr>
                <td>${item.source}</td>
                <td>${formatCurrency(item.planned)}</td>
                <td>${formatCurrency(item.actual)}</td>
                <td class="${difference >= 0 ? 'difference-positive' : 'difference-negative'}">
                    ${formatCurrency(difference)}
                </td>
                <td>
                    <button class="btn-edit" onclick="editItem('income', ${item.id})">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteItem('income', ${item.id})">🗑️ حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Update totals
    document.getElementById('income-planned-total').textContent = formatCurrency(plannedTotal);
    document.getElementById('income-actual-total').textContent = formatCurrency(actualTotal);
    document.getElementById('income-difference-total').textContent = formatCurrency(actualTotal - plannedTotal);
}

function saveIncome(event) {
    event.preventDefault();
    
    const source = document.getElementById('income-source').value;
    const planned = parseFloat(document.getElementById('income-planned').value);
    const actual = parseFloat(document.getElementById('income-actual').value);
    
    const newItem = {
        id: Date.now(),
        source,
        planned,
        actual
    };
    
    budgetData.income.push(newItem);
    saveData();
    updateIncomeTable();
    closeModal();
}

// ===== Expenses Page Functions =====
function updateExpenseTable() {
    const tbody = document.getElementById('expense-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let plannedTotal = 0;
    let actualTotal = 0;
    
    budgetData.expenses.forEach(item => {
        const difference = item.actual - item.planned;
        plannedTotal += item.planned;
        actualTotal += item.actual;
        
        const row = `
            <tr>
                <td>${item.category}</td>
                <td>${formatCurrency(item.planned)}</td>
                <td>${formatCurrency(item.actual)}</td>
                <td class="${difference >= 0 ? 'difference-negative' : 'difference-positive'}">
                    ${formatCurrency(difference)}
                </td>
                <td>
                    <button class="btn-edit" onclick="editItem('expense', ${item.id})">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteItem('expense', ${item.id})">🗑️ حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Update totals
    document.getElementById('expense-planned-total').textContent = formatCurrency(plannedTotal);
    document.getElementById('expense-actual-total').textContent = formatCurrency(actualTotal);
    document.getElementById('expense-difference-total').textContent = formatCurrency(actualTotal - plannedTotal);
    
    // Update pie chart
    createExpensesPieChart();
}

function createExpensesPieChart() {
    const ctx = document.getElementById('expensesPieChart');
    if (!ctx) return;
    
    const categories = budgetData.expenses.map(item => item.category);
    const amounts = budgetData.expenses.map(item => item.actual);
    const colors = ['#3b82f6', '#f97316', '#10b981', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function saveExpense(event) {
    event.preventDefault();
    
    const category = document.getElementById('expense-category').value;
    const planned = parseFloat(document.getElementById('expense-planned').value);
    const actual = parseFloat(document.getElementById('expense-actual').value);
    
    const newItem = {
        id: Date.now(),
        category,
        planned,
        actual
    };
    
    budgetData.expenses.push(newItem);
    saveData();
    updateExpenseTable();
    closeModal();
}

// ===== Bills Page Functions =====
function updateBillTable() {
    const tbody = document.getElementById('bill-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let plannedTotal = 0;
    let actualTotal = 0;
    
    budgetData.bills.forEach(item => {
        const difference = item.actual - item.planned;
        plannedTotal += item.planned;
        actualTotal += item.actual;
        
        const statusClass = item.status === 'مدفوعة' ? 'status-paid' : 'status-overdue';
        const statusIcon = item.status === 'مدفوعة' ? '✅' : '⏳';
        
        const row = `
            <tr>
                <td>${item.type}</td>
                <td>${formatCurrency(item.planned)}</td>
                <td>${formatCurrency(item.actual)}</td>
                <td class="${difference >= 0 ? 'difference-negative' : 'difference-positive'}">
                    ${formatCurrency(difference)}
                </td>
                <td><span class="status-badge ${statusClass}">${statusIcon} ${item.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="editItem('bill', ${item.id})">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteItem('bill', ${item.id})">🗑️ حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Update totals
    document.getElementById('bill-planned-total').textContent = formatCurrency(plannedTotal);
    document.getElementById('bill-actual-total').textContent = formatCurrency(actualTotal);
    document.getElementById('bill-difference-total').textContent = formatCurrency(actualTotal - plannedTotal);
}

function saveBill(event) {
    event.preventDefault();
    
    const type = document.getElementById('bill-type').value;
    const planned = parseFloat(document.getElementById('bill-planned').value);
    const actual = parseFloat(document.getElementById('bill-actual').value);
    const status = document.getElementById('bill-status').value;
    
    const newItem = {
        id: Date.now(),
        type,
        planned,
        actual,
        status
    };
    
    budgetData.bills.push(newItem);
    saveData();
    updateBillTable();
    closeModal();
}

// ===== Savings Page Functions =====
function updateSavingTable() {
    const tbody = document.getElementById('saving-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let plannedTotal = 0;
    let actualTotal = 0;
    
    budgetData.savings.forEach(item => {
        const percentage = ((item.actual / item.planned) * 100).toFixed(1);
        plannedTotal += item.planned;
        actualTotal += item.actual;
        
        const row = `
            <tr>
                <td>${item.type}</td>
                <td>${formatCurrency(item.planned)}</td>
                <td>${formatCurrency(item.actual)}</td>
                <td>${percentage}%</td>
                <td>
                    <button class="btn-edit" onclick="editItem('saving', ${item.id})">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteItem('saving', ${item.id})">🗑️ حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    const totalPercentage = plannedTotal > 0 ? ((actualTotal / plannedTotal) * 100).toFixed(1) : 0;
    
    // Update totals
    document.getElementById('saving-planned-total').textContent = formatCurrency(plannedTotal);
    document.getElementById('saving-actual-total').textContent = formatCurrency(actualTotal);
    document.getElementById('saving-percentage-total').textContent = totalPercentage + '%';
    
    // Update progress chart
    createSavingsProgressChart();
}

function createSavingsProgressChart() {
    const ctx = document.getElementById('savingsProgressChart');
    if (!ctx) return;
    
    const labels = budgetData.savings.map(item => item.type);
    const planned = budgetData.savings.map(item => item.planned);
    const actual = budgetData.savings.map(item => item.actual);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'الهدف',
                    data: planned,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 8
                },
                {
                    label: 'المدخر حالياً',
                    data: actual,
                    backgroundColor: '#10b981',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function saveSaving(event) {
    event.preventDefault();
    
    const type = document.getElementById('saving-type').value;
    const planned = parseFloat(document.getElementById('saving-planned').value);
    const actual = parseFloat(document.getElementById('saving-actual').value);
    
    const newItem = {
        id: Date.now(),
        type,
        planned,
        actual
    };
    
    budgetData.savings.push(newItem);
    saveData();
    updateSavingTable();
    closeModal();
}

// ===== Modal Functions =====
function openAddModal(type) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    
    // Reset forms
    const forms = ['income-form', 'expense-form', 'bill-form', 'saving-form'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.reset();
    });
}

// ===== CRUD Functions =====
function deleteItem(type, id) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    const key = type === 'income' ? 'income' : 
                type === 'expense' ? 'expenses' : 
                type === 'bill' ? 'bills' : 'savings';
    
    budgetData[key] = budgetData[key].filter(item => item.id !== id);
    saveData();
    
    // Update appropriate table
    if (type === 'income') updateIncomeTable();
    else if (type === 'expense') updateExpenseTable();
    else if (type === 'bill') updateBillTable();
    else if (type === 'saving') updateSavingTable();
}

function editItem(type, id) {
    // This would open the modal with pre-filled data
    // For simplicity, this is a placeholder
    alert('وظيفة التعديل ستتوفر قريباً');
}

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' ريال';
}

function updateCurrentMonth() {
    const monthElement = document.getElementById('current-month');
    if (!monthElement) return;
    
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const now = new Date();
    monthElement.textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ===== Page Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === '' || currentPage === 'index.html') {
        updateCurrentMonth();
        updateDashboard();
    } else if (currentPage === 'income.html') {
        updateIncomeTable();
    } else if (currentPage === 'expenses.html') {
        updateExpenseTable();
    } else if (currentPage === 'bills.html') {
        updateBillTable();
    } else if (currentPage === 'savings.html') {
        updateSavingTable();
    }
    
    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
