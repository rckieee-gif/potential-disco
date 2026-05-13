const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseQuickEntry,
  quickEntryResponse,
  categories,
  groupOctavioCategories,
} = require("../src/parser");

test("parses wood repair as an Octavio-compatible repair expense", () => {
  const parsed = parseQuickEntry("bought wood repair for about 400 pesos", {
    today: "2026-05-14",
  });

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.transactionType, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Minor Repair");
  assert.equal(parsed.quickCategory, "Repairs and Maintenance");
  assert.equal(parsed.description, "Wood Repair");
  assert.equal(parsed.amount, 400);
  assert.equal(parsed.quantity, null);
  assert.equal(parsed.unit, "");
  assert.equal(parsed.unitPrice, null);
  assert.equal(parsed.amountSource, "estimated");
  assert.equal(parsed.currency, "PHP");
  assert.equal(parsed.paymentMethod, "Cash");
  assert.equal(parsed.building, "All");
  assert.equal(parsed.paidBy, "Rolly");
  assert.equal(parsed.date, "2026-05-14");
  assert.equal(parsed.originalText, "bought wood repair for about 400 pesos");
  assert.ok(parsed.confidence >= 0.8);
});

test("wraps parsed output with needsReview false when confidence is high", () => {
  const response = quickEntryResponse("bought wood repair for about 400 pesos", {
    today: "2026-05-14",
  });

  assert.equal(response.needsReview, false);
  assert.equal(response.parsed.fundingNature, "OPEX");
  assert.equal(response.parsed.category, "Minor Repair");
});

test("detects revenue entries", () => {
  const parsed = parseQuickEntry("sold eggs for 1200 pesos", {
    today: "2026-05-14",
  });

  assert.equal(parsed.type, "Income");
  assert.equal(parsed.transactionType, "Income");
  assert.equal(parsed.fundingNature, "Revenue");
  assert.equal(parsed.category, "Net Meat Sale");
  assert.equal(parsed.amount, 1200);
  assert.equal(parsed.amountSource, "explicit");
});

test("calculates amount from quantity and unit price", () => {
  const parsed = parseQuickEntry("bought 2 sacks feeds at 1500 pesos each", {
    today: "2026-05-14",
  });

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Feed");
  assert.equal(parsed.description, "Feed");
  assert.equal(parsed.quantity, 2);
  assert.equal(parsed.unit, "sack");
  assert.equal(parsed.unitPrice, 1500);
  assert.equal(parsed.amount, 3000);
  assert.equal(parsed.amountSource, "quantity_x_unit_price");
});

test("keeps explicit total when quantity and unit price are also present", () => {
  const parsed = parseQuickEntry("bought 2 sacks feeds at 1500 each total 2900 pesos", {
    today: "2026-05-14",
  });

  assert.equal(parsed.quantity, 2);
  assert.equal(parsed.unit, "sack");
  assert.equal(parsed.unitPrice, 1500);
  assert.equal(parsed.amount, 2900);
  assert.equal(parsed.amountSource, "explicit");
});

test("treats bought sacks as supplies expense", () => {
  const parsed = parseQuickEntry("bought sacks 300 pesos", {
    today: "2026-05-14",
  });

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Supplies");
  assert.equal(parsed.quickCategory, "Supplies");
  assert.equal(parsed.amount, 300);
});

test("treats sold empty sacks as revenue", () => {
  const parsed = parseQuickEntry("sold empty sacks 300 pesos", {
    today: "2026-05-14",
  });

  assert.equal(parsed.type, "Income");
  assert.equal(parsed.fundingNature, "Revenue");
  assert.equal(parsed.category, "Empty Sack Sale");
  assert.equal(parsed.quickCategory, "Sales Revenue");
  assert.equal(parsed.amount, 300);
});

test("parses relative English and Bisaya dates", () => {
  const cases = [
    ["bought feeds today 100 pesos", "2026-05-14"],
    ["bought feeds this morning 100 pesos", "2026-05-14"],
    ["bought feeds karong buntag 100 pesos", "2026-05-14"],
    ["bought feeds yesterday 100 pesos", "2026-05-13"],
    ["bought feeds gahapon 100 pesos", "2026-05-13"],
    ["bought feeds kagahapon 100 pesos", "2026-05-13"],
    ["bought feeds last week 100 pesos", "2026-05-07"],
  ];

  for (const [text, expectedDate] of cases) {
    const parsed = parseQuickEntry(text, { today: "2026-05-14" });
    assert.equal(parsed.date, expectedDate, text);
    assert.equal(parsed.description, "Feeds", text);
  }
});

test("parses last weekday dates", () => {
  assert.equal(
    parseQuickEntry("bought feeds last monday 100 pesos", { today: "2026-05-14" }).date,
    "2026-05-11",
  );
  assert.equal(
    parseQuickEntry("bought feeds last monday 100 pesos", { today: "2026-05-14" }).description,
    "Feeds",
  );
  assert.equal(
    parseQuickEntry("bought feeds last Thursday 100 pesos", { today: "2026-05-14" }).date,
    "2026-05-07",
  );
});

test("parses month-name dates", () => {
  const cases = [
    ["bought feeds May 14 100 pesos", "2026-05-14"],
    ["bought feeds May 10 100 pesos", "2026-05-10"],
    ["bought feeds 14 May 100 pesos", "2026-05-14"],
    ["bought feeds May 10, 2026 100 pesos", "2026-05-10"],
    ["bought feeds 14 May 2026 100 pesos", "2026-05-14"],
  ];

  for (const [text, expectedDate] of cases) {
    const parsed = parseQuickEntry(text, { today: "2026-05-14" });
    assert.equal(parsed.date, expectedDate, text);
    assert.equal(parsed.description, "Feeds", text);
  }
});

test("parses numeric dates", () => {
  const cases = [
    ["bought feeds 05/14/2026 100 pesos", "2026-05-14"],
    ["bought feeds 5/10/26 100 pesos", "2026-05-10"],
    ["bought feeds 14/05/2026 100 pesos", "2026-05-14"],
    ["bought feeds 05-14-2026 100 pesos", "2026-05-14"],
  ];

  for (const [text, expectedDate] of cases) {
    const parsed = parseQuickEntry(text, { today: "2026-05-14" });
    assert.equal(parsed.date, expectedDate, text);
    assert.equal(parsed.description, "Feeds", text);
  }
});

test("marks vague entries for review", () => {
  const response = quickEntryResponse("misc purchase", {
    today: "2026-05-14",
  });

  assert.equal(response.needsReview, true);
  assert.equal(response.parsed.amount, null);
  assert.equal(response.parsed.fundingNature, "OPEX");
  assert.equal(response.parsed.category, "Miscellaneous");
});

test("keeps the initial farm categories available", () => {
  assert.deepEqual(categories, [
    "Feeds",
    "Medicine / Vet",
    "Labor",
    "Repairs and Maintenance",
    "Utilities",
    "Transport",
    "Supplies",
    "Equipment",
    "Sales Revenue",
    "Other Expense",
    "Other Revenue",
  ]);
});

test("exposes Octavio ledger categories grouped by funding nature", () => {
  const grouped = groupOctavioCategories();

  assert.ok(grouped.OPEX.includes("Feed"));
  assert.ok(grouped.OPEX.includes("Minor Repair"));
  assert.ok(grouped.CAPEX.includes("Building Repair"));
  assert.ok(grouped.Revenue.includes("Net Meat Sale"));
});
