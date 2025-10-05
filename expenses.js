// Expenses page specific functions
document.addEventListener('DOMContentLoaded', function() {
    setCurrentMonth();
    loadExpensesData();
    setupExpensesForm();
    initializeExpensesChart();
});

// Load expenses data into table
function loadExpensesData() {
    const tbody = document.getElementById('expensesTableBody');
    tbody.innerHTML = '';
    
    budgetData.expenses.forEach((item, index) => {
        const row = document.createElement('tr');
        const difference = item.actual - item.planned;
        const differenceClass = difference <= 0 ? 'status-paid' : 'status-overdue';
        const differenceIcon = difference <= 0 ? 'fa-arrow-down' : 'fa-arrow-up';
        
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td class="${differenceClass}">
                <i class="fas ${differenceIcon}"></i>
                ${formatCurrency(Math.abs(difference))}
            </td>
            <td>
                <button class="btn" onclick="editExpense(${index})" style="padding: 0.5rem; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="deleteExpense(${index})" style="padding: 0.5rem; font-size: 0.8rem; background: #f44336;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup expenses form
function setupExpensesForm() {
    const form = document.getElementById('addExpenseForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('expenseCategory').value;
        const planned = parseFloat(document.getElementById('expensePlanned').value);
        const actual = parseFloat(document.getElementById('expenseActual').value);
        
        // Add new expense
        budgetData.expenses.push({
            category: category,
            planned: planned,
            actual: actual
        });
        
        // Reload table and chart
        loadExpensesData();
        initializeExpensesChart();
        
        // Close modal and reset form
        closeModal('addExpenseModal');
        form.reset();
        
        // Show success message
        alert('تم إضافة المصروف بنجاح!');
    });
}

// Edit expense item
function editExpense(index) {
    const item = budgetData.expenses[index];
    
    const newCategory = prompt('الفئة:', item.category);
    if (newCategory === null) return;
    
    const newPlanned = prompt('المبلغ المخطط:', item.planned);
    if (newPlanned === null) return;
    
    const newActual = prompt('المبلغ الفعلي:', item.actual);
    if (newActual === null) return;
    
    budgetData.expenses[index] = {
        category: newCategory,
        planned: parseFloat(newPlanned),
        actual: parseFloat(newActual)
    };
    
    loadExpensesData();
    initializeExpensesChart();
    alert('تم تحديث المصروف بنجاح!');
}

// Delete expense item
function deleteExpense(index) {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
        budgetData.expenses.splice(index, 1);
        loadExpensesData();
        initializeExpensesChart();
        alert('تم حذف المصروف بنجاح!');
    }
}

// Initialize expenses chart
function initializeExpensesChart() {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.expensesChartInstance) {
        window.expensesChartInstance.destroy();
    }
    
    const categories = budgetData.expenses.map(item => item.category);
    const amounts = budgetData.expenses.map(item => item.actual);
    
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    window.expensesChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 2,
                borderColor: '#fff'
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
                            const total = amounts.reduce((sum, amount) => sum + amount, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed.toLocaleString() + ' ريال (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}