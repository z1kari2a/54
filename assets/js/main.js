/* Main JS for Budget Management Website */
(function () {
  const storageKey = window.BUDGET_STORAGE_KEY || "budgetAppData";

  function getStoredData() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return structuredClone(window.defaultBudgetData);
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.warn("Failed to parse stored data, using defaults", e);
      return structuredClone(window.defaultBudgetData);
    }
  }

  function setStoredData(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function numberFormat(value) {
    try {
      return new Intl.NumberFormat("ar", { maximumFractionDigits: 0 }).format(
        Number(value) || 0
      );
    } catch (e) {
      return String(value);
    }
  }

  function sumBy(list, selector) {
    return list.reduce((acc, item) => acc + (Number(selector(item)) || 0), 0);
  }

  function computeTotals(data) {
    const totalIncome = sumBy(data.income, (x) => x.actual);
    const totalExpenses = sumBy(data.expenses, (x) => x.actual);
    const totalBills = sumBy(data.bills, (x) => x.actual);
    const totalSavings = sumBy(data.savings, (x) => x.actual);
    const used = totalExpenses + totalBills + totalSavings;
    const leftover = Math.max(0, totalIncome - used);

    return {
      totalIncome,
      totalExpenses,
      totalBills,
      totalSavings,
      used,
      leftover,
    };
  }

  function setActiveNav() {
    const links = document.querySelectorAll(".nav-link");
    const path = location.pathname.split("/").pop() || "index.html";
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if ((path === "index.html" && href === "index.html") || path === href) {
        a.classList.add("active");
      }
    });
  }

  function setMonthHeader(month) {
    const monthEl = document.getElementById("monthName");
    if (monthEl) monthEl.textContent = month;
  }

  // ----- Dashboard -----
  function renderDashboard(data) {
    const { totalIncome, totalExpenses, totalBills, totalSavings, used, leftover } =
      computeTotals(data);

    setText("totalIncome", numberFormat(totalIncome));
    setText("totalExpenses", numberFormat(totalExpenses));
    setText("totalBills", numberFormat(totalBills));
    setText("totalSavings", numberFormat(totalSavings));

    const donutCtx = byId("leftoverChart");
    if (donutCtx) {
      new Chart(donutCtx, {
        type: "doughnut",
        data: {
          labels: ["المصروف/المدفوع", "المتبقي"],
          datasets: [
            {
              data: [used, leftover],
              backgroundColor: ["#f59e0b", "#10b981"],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${numberFormat(ctx.parsed)}`,
              },
            },
          },
          cutout: "60%",
        },
      });
    }

    const barCtx = byId("cashflowChart");
    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["الدخل", "المصاريف", "الفواتير", "المدخرات"],
          datasets: [
            {
              label: "فعلي",
              data: [totalIncome, totalExpenses, totalBills, totalSavings],
              backgroundColor: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${numberFormat(ctx.parsed.y)}`,
              },
            },
          },
          scales: {
            y: {
              ticks: { callback: (v) => numberFormat(v) },
              grid: { color: "#e5e7eb" },
              beginAtZero: true,
            },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }

  // ----- Income Page -----
  function renderIncomePage(data) {
    const tbody = byId("incomeTbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    data.income.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.source)}</td>
        <td>${numberFormat(row.planned)}</td>
        <td>${numberFormat(row.actual)}</td>
      `;
      tbody.appendChild(tr);
    });

    const addBtn = byId("addIncomeBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const source = prompt("مصدر الدخل؟");
        if (!source) return;
        const plannedStr = prompt("المبلغ المخطط؟");
        const actualStr = prompt("المبلغ الفعلي؟");
        const planned = Number(plannedStr || 0);
        const actual = Number(actualStr || 0);
        const newItem = { id: `i${Date.now()}`, source, planned, actual };
        data.income.push(newItem);
        setStoredData(data);
        renderIncomePage(data);
      });
    }
  }

  // ----- Expenses Page -----
  function renderExpensesPage(data) {
    const tbody = byId("expensesTbody");
    if (tbody) {
      tbody.innerHTML = "";
      data.expenses.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(row.category)}</td>
          <td>${numberFormat(row.planned)}</td>
          <td>${numberFormat(row.actual)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    const addBtn = byId("addExpenseBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const category = prompt("فئة المصروف؟");
        if (!category) return;
        const plannedStr = prompt("المبلغ المخطط؟");
        const actualStr = prompt("المبلغ الفعلي؟");
        const planned = Number(plannedStr || 0);
        const actual = Number(actualStr || 0);
        const newItem = { id: `e${Date.now()}`, category, planned, actual };
        data.expenses.push(newItem);
        setStoredData(data);
        renderExpensesPage(data);
      });
    }

    const canvas = byId("expensesBreakdownChart");
    if (canvas) {
      const labels = data.expenses.map((x) => x.category);
      const values = data.expenses.map((x) => x.actual);
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#3b82f6",
                "#ef4444",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#06b6d4",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${numberFormat(ctx.parsed)}`,
              },
            },
          },
          cutout: "50%",
        },
      });
    }
  }

  // ----- Bills Page -----
  function renderBillsPage(data) {
    const tbody = byId("billsTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.bills.forEach((row) => {
      const tr = document.createElement("tr");
      const isPaid = row.status === "paid";
      tr.innerHTML = `
        <td>${escapeHtml(row.type)}</td>
        <td>${numberFormat(row.planned)}</td>
        <td>${numberFormat(row.actual)}</td>
        <td>
          <button class="chip ${isPaid ? "paid" : "late"}" data-id="${row.id}">
            ${isPaid ? "مدفوعة ✅" : "متأخرة ⏳"}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const bill = data.bills.find((b) => b.id === id);
        if (!bill) return;
        bill.status = bill.status === "paid" ? "late" : "paid";
        setStoredData(data);
        renderBillsPage(data);
      });
    });
  }

  // ----- Savings Page -----
  function renderSavingsPage(data) {
    const tbody = byId("savingsTbody");
    if (tbody) {
      tbody.innerHTML = "";
      data.savings.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(row.type)}</td>
          <td>${numberFormat(row.planned)}</td>
          <td>${numberFormat(row.actual)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    const canvas = byId("savingsProgressChart");
    if (canvas) {
      const labels = data.savings.map((x) => x.type);
      const values = data.savings.map((x) => {
        if (!x.goal || x.goal <= 0) return 0;
        return Math.min(100, Math.round((Number(x.actual) / Number(x.goal)) * 100));
      });

      new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "% التقدم نحو الهدف",
              data: values,
              backgroundColor: "#10b981",
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.parsed.y}%`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (v) => `${v}%`,
              },
              grid: { color: "#e5e7eb" },
            },
            x: { grid: { display: false } },
          },
        },
      });
    }
  }

  // ----- Helpers -----
  function byId(id) { return document.getElementById(id); }
  function setText(id, text) { const el = byId(id); if (el) el.textContent = text; }
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Expose a hook to run after navbar partial is injected
  window.budgetAppAfterNavbarLoad = function () {
    try {
      setActiveNav();
      const data = getStoredData();
      setMonthHeader(data.month);
    } catch (e) {
      // no-op
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    const data = getStoredData();
    setMonthHeader(data.month);

    const page = document.body.getAttribute("data-page") || "dashboard";
    if (page === "dashboard") renderDashboard(data);
    if (page === "income") renderIncomePage(data);
    if (page === "expenses") renderExpensesPage(data);
    if (page === "bills") renderBillsPage(data);
    if (page === "savings") renderSavingsPage(data);
  });
})();
