// Income page specific functions
document.addEventListener('DOMContentLoaded', function() {
    setCurrentMonth();
    loadIncomeData();
    setupIncomeForm();
});

// Load income data into table
function loadIncomeData() {
    const tbody = document.getElementById('incomeTableBody');
    tbody.innerHTML = '';
    
    budgetData.income.forEach((item, index) => {
        const row = document.createElement('tr');
        const difference = item.actual - item.planned;
        const differenceClass = difference >= 0 ? 'status-paid' : 'status-overdue';
        const differenceIcon = difference >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        row.innerHTML = `
            <td>${item.source}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td class="${differenceClass}">
                <i class="fas ${differenceIcon}"></i>
                ${formatCurrency(Math.abs(difference))}
            </td>
            <td>
                <button class="btn" onclick="editIncome(${index})" style="padding: 0.5rem; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="deleteIncome(${index})" style="padding: 0.5rem; font-size: 0.8rem; background: #f44336;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup income form
function setupIncomeForm() {
    const form = document.getElementById('addIncomeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const source = document.getElementById('incomeSource').value;
        const planned = parseFloat(document.getElementById('incomePlanned').value);
        const actual = parseFloat(document.getElementById('incomeActual').value);
        
        // Add new income source
        budgetData.income.push({
            source: source,
            planned: planned,
            actual: actual
        });
        
        // Reload table
        loadIncomeData();
        
        // Close modal and reset form
        closeModal('addIncomeModal');
        form.reset();
        
        // Show success message
        alert('تم إضافة مصدر الدخل بنجاح!');
    });
}

// Edit income item
function editIncome(index) {
    const item = budgetData.income[index];
    
    const newSource = prompt('المصدر:', item.source);
    if (newSource === null) return;
    
    const newPlanned = prompt('المبلغ المخطط:', item.planned);
    if (newPlanned === null) return;
    
    const newActual = prompt('المبلغ الفعلي:', item.actual);
    if (newActual === null) return;
    
    budgetData.income[index] = {
        source: newSource,
        planned: parseFloat(newPlanned),
        actual: parseFloat(newActual)
    };
    
    loadIncomeData();
    alert('تم تحديث مصدر الدخل بنجاح!');
}

// Delete income item
function deleteIncome(index) {
    if (confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
        budgetData.income.splice(index, 1);
        loadIncomeData();
        alert('تم حذف مصدر الدخل بنجاح!');
    }
}