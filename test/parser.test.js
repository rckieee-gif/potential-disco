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
