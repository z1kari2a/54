// Savings page specific functions
document.addEventListener('DOMContentLoaded', function() {
    setCurrentMonth();
    loadSavingsData();
    setupSavingsForm();
    initializeSavingsChart();
});

// Load savings data into table
function loadSavingsData() {
    const tbody = document.getElementById('savingsTableBody');
    tbody.innerHTML = '';
    
    budgetData.savings.forEach((item, index) => {
        const row = document.createElement('tr');
        const progress = (item.actual / item.planned) * 100;
        const progressClass = progress >= 100 ? 'status-paid' : progress >= 75 ? 'status-pending' : 'status-overdue';
        
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${formatCurrency(item.planned)}</td>
            <td>${formatCurrency(item.actual)}</td>
            <td class="${progressClass}">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="flex: 1; background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: ${progress >= 100 ? '#4CAF50' : progress >= 75 ? '#ff9800' : '#f44336'}; 
                                    height: 100%; width: ${Math.min(progress, 100)}%; transition: width 0.3s ease;"></div>
                    </div>
                    <span>${progress.toFixed(1)}%</span>
                </div>
            </td>
            <td>
                <button class="btn" onclick="editSaving(${index})" style="padding: 0.5rem; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="deleteSaving(${index})" style="padding: 0.5rem; font-size: 0.8rem; background: #f44336;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup savings form
function setupSavingsForm() {
    const form = document.getElementById('addSavingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('savingType').value;
        const planned = parseFloat(document.getElementById('savingPlanned').value);
        const actual = parseFloat(document.getElementById('savingActual').value);
        
        // Add new saving
        budgetData.savings.push({
            type: type,
            planned: planned,
            actual: actual
        });
        
        // Reload table and chart
        loadSavingsData();
        initializeSavingsChart();
        
        // Close modal and reset form
        closeModal('addSavingModal');
        form.reset();
        
        // Show success message
        alert('تم إضافة المدخر بنجاح!');
    });
}

// Edit saving item
function editSaving(index) {
    const item = budgetData.savings[index];
    
    const newType = prompt('نوع الادخار:', item.type);
    if (newType === null) return;
    
    const newPlanned = prompt('المبلغ المخطط:', item.planned);
    if (newPlanned === null) return;
    
    const newActual = prompt('المبلغ الفعلي:', item.actual);
    if (newActual === null) return;
    
    budgetData.savings[index] = {
        type: newType,
        planned: parseFloat(newPlanned),
        actual: parseFloat(newActual)
    };
    
    loadSavingsData();
    initializeSavingsChart();
    alert('تم تحديث المدخر بنجاح!');
}

// Delete saving item
function deleteSaving(index) {
    if (confirm('هل أنت متأكد من حذف هذا المدخر؟')) {
        budgetData.savings.splice(index, 1);
        loadSavingsData();
        initializeSavingsChart();
        alert('تم حذف المدخر بنجاح!');
    }
}

// Initialize savings progress chart
function initializeSavingsChart() {
    const ctx = document.getElementById('savingsProgressChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.savingsChartInstance) {
        window.savingsChartInstance.destroy();
    }
    
    const types = budgetData.savings.map(item => item.type);
    const planned = budgetData.savings.map(item => item.planned);
    const actual = budgetData.savings.map(item => item.actual);
    
    window.savingsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: types,
            datasets: [
                {
                    label: 'المخطط',
                    data: planned,
                    backgroundColor: '#e3f2fd',
                    borderColor: '#2196F3',
                    borderWidth: 2
                },
                {
                    label: 'الفعلي',
                    data: actual,
                    backgroundColor: '#4CAF50',
                    borderColor: '#388E3C',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' ريال';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' ريال';
                        }
                    }
                }
            }
        }
    });
}