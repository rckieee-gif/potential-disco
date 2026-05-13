const test = require("node:test");
const assert = require("node:assert/strict");
const { geminiQuickEntrySchema, normalizeAiParsed } = require("../src/aiParser");

test("normalizes AI output for a mixed Bisaya repair entry", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Expense",
      transactionType: "Expense",
      fundingNature: "OPEX",
      category: "Minor Repair",
      quickCategory: "Repairs and Maintenance",
      description: "Wood Repair",
      amount: 400,
      quantity: null,
      unit: "",
      unitPrice: null,
      amountSource: "estimated",
      currency: "PHP",
      paymentMethod: "Cash",
      building: "All",
      paidBy: "Rolly",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "2026-05-14",
      confidence: 0.9,
      originalText: "nipalit kog kahoy pang repair mga 400 pesos",
    },
    "nipalit kog kahoy pang repair mga 400 pesos",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Minor Repair");
  assert.equal(parsed.amount, 400);
  assert.equal(parsed.amountSource, "estimated");
  assert.equal(parsed.originalText, "nipalit kog kahoy pang repair mga 400 pesos");
});

test("repairs invalid AI funding/category pairs", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Expense",
      transactionType: "Expense",
      fundingNature: "Revenue",
      category: "Minor Repair",
      quickCategory: "Repairs and Maintenance",
      description: "Wood Repair",
      amount: 400,
      quantity: null,
      unit: "",
      unitPrice: null,
      amountSource: "explicit",
      currency: "PHP",
      paymentMethod: "Cash",
      building: "All",
      paidBy: "Rolly",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "2026-05-14",
      confidence: 0.9,
      originalText: "bought wood repair for about 400 pesos",
    },
    "bought wood repair for about 400 pesos",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Minor Repair");
});

test("does not allow AI revenue categories for expense entries", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Expense",
      transactionType: "Expense",
      fundingNature: "Revenue",
      category: "Empty Sack Sale",
      quickCategory: "Sales Revenue",
      description: "Sacks",
      amount: 300,
      quantity: null,
      unit: "",
      unitPrice: null,
      amountSource: "explicit",
      currency: "PHP",
      paymentMethod: "Cash",
      building: "All",
      paidBy: "Rolly",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "2026-05-14",
      confidence: 0.9,
      originalText: "bought sacks 300 pesos",
    },
    "bought sacks 300 pesos",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Supplies");
});

test("preserves AI empty sack sale when the entry is income", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Income",
      transactionType: "Income",
      fundingNature: "Revenue",
      category: "Empty Sack Sale",
      quickCategory: "Sales Revenue",
      description: "Empty Sack Sale",
      amount: 300,
      quantity: null,
      unit: "",
      unitPrice: null,
      amountSource: "explicit",
      currency: "PHP",
      paymentMethod: "Cash",
      building: "All",
      paidBy: "Rolly",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "2026-05-14",
      confidence: 0.9,
      originalText: "sold empty sacks 300 pesos",
    },
    "sold empty sacks 300 pesos",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.type, "Income");
  assert.equal(parsed.fundingNature, "Revenue");
  assert.equal(parsed.category, "Empty Sack Sale");
});

test("normalizes AI quantity and unit price fields", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Expense",
      transactionType: "Expense",
      fundingNature: "OPEX",
      category: "Feed",
      quickCategory: "Feeds",
      description: "Feeds",
      amount: 3000,
      quantity: 2,
      unit: "sack",
      unitPrice: 1500,
      amountSource: "quantity_x_unit_price",
      currency: "PHP",
      paymentMethod: "Cash",
      building: "All",
      paidBy: "Rolly",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "2026-05-14",
      confidence: 0.94,
      originalText: "bought 2 sacks feeds at 1500 pesos each",
    },
    "bought 2 sacks feeds at 1500 pesos each",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.quantity, 2);
  assert.equal(parsed.unit, "sack");
  assert.equal(parsed.unitPrice, 1500);
  assert.equal(parsed.amountSource, "quantity_x_unit_price");
});


test("falls back to rule-derived values for bad AI primitives", () => {
  const parsed = normalizeAiParsed(
    {
      type: "Something Else",
      transactionType: "Something Else",
      fundingNature: "Not Real",
      category: "Not Real",
      quickCategory: "Other Expense",
      description: "",
      amount: "not a number",
      quantity: "bad",
      unit: "",
      unitPrice: "bad",
      amountSource: "bad",
      currency: "abc",
      paymentMethod: "",
      building: "",
      paidBy: "",
      paidTo: "",
      reference: "",
      remarks: "",
      date: "tomorrow",
      confidence: 3,
      originalText: "nagbayad sweldo 500 pesos",
    },
    "nagbayad sweldo 500 pesos",
    { today: "2026-05-14" },
  );

  assert.equal(parsed.type, "Expense");
  assert.equal(parsed.fundingNature, "OPEX");
  assert.equal(parsed.category, "Labor");
  assert.equal(parsed.amount, 500);
  assert.equal(parsed.amountSource, "explicit");
  assert.equal(parsed.currency, "PHP");
  assert.equal(parsed.date, "2026-05-14");
  assert.equal(parsed.confidence, 0.99);
});

test("Gemini schema allows nullable amount using Gemini-supported JSON schema shape", () => {
  assert.deepEqual(geminiQuickEntrySchema.properties.amount.type, ["number", "null"]);
  assert.deepEqual(geminiQuickEntrySchema.properties.quantity.type, ["number", "null"]);
  assert.deepEqual(geminiQuickEntrySchema.properties.unitPrice.type, ["number", "null"]);
  assert.equal(geminiQuickEntrySchema.properties.fundingNature.enum.includes("OPEX"), true);
  assert.equal(geminiQuickEntrySchema.properties.category.enum.includes("Minor Repair"), true);
});
