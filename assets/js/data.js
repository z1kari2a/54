// Default seed data for the month (Arabic RTL)
window.BUDGET_STORAGE_KEY = "budgetAppData:v1";

window.defaultBudgetData = {
  month: "سبتمبر",
  currency: "USD",
  income: [
    { id: "i1", source: "راتب", planned: 10000, actual: 10000 },
    { id: "i2", source: "عمل حر", planned: 2000, actual: 1800 }
  ],
  expenses: [
    { id: "e1", category: "أكل", planned: 1200, actual: 1000 },
    { id: "e2", category: "مواصلات", planned: 600, actual: 700 },
    { id: "e3", category: "تسلية", planned: 400, actual: 300 }
  ],
  bills: [
    { id: "b1", type: "إيجار", planned: 3000, actual: 3000, status: "paid" },
    { id: "b2", type: "كهرباء", planned: 300, actual: 280, status: "paid" },
    { id: "b3", type: "إنترنت", planned: 150, actual: 150, status: "late" }
  ],
  savings: [
    { id: "s1", type: "حساب توفير", planned: 1000, actual: 700, goal: 5000 },
    { id: "s2", type: "استثمار", planned: 500, actual: 500, goal: 10000 }
  ]
};
