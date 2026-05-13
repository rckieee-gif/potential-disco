const {
  categories,
  octavioLedgerCategories,
  groupOctavioCategories,
} = require("./categories");

const CATEGORY_RULES = [
  {
    quickCategory: "Sales Revenue",
    fundingNature: "Revenue",
    category: "Empty Sack Sale",
    patterns: [/\bempty sacks?\b/i, /\bsacks?\b/i],
  },
  {
    quickCategory: "Sales Revenue",
    fundingNature: "Revenue",
    category: "Net Meat Sale",
    patterns: [
      /\bsold\b/i,
      /\bbaligya\b/i,
      /\bhalin\b/i,
      /\bkinita\b/i,
      /\bsale\b/i,
      /\bsales\b/i,
      /\brevenue\b/i,
      /\bincome\b/i,
      /\breceived\b/i,
      /\bearned\b/i,
      /\bmeat\b/i,
      /\bchickens?\b/i,
    ],
  },
  {
    quickCategory: "Feeds",
    fundingNature: "OPEX",
    category: "Feed",
    patterns: [
      /\bfeeds?\b/i,
      /\bpakaon\b/i,
      /\bpagkaon\b/i,
      /\bpellets?\b/i,
      /\bmash\b/i,
      /\bcorn\b/i,
      /\bbran\b/i,
      /\bstarter\b/i,
      /\bgrower\b/i,
    ],
  },
  {
    quickCategory: "Medicine / Vet",
    fundingNature: "OPEX",
    category: "Medicine",
    patterns: [
      /\bmedicine\b/i,
      /\btambal\b/i,
      /\bgamot\b/i,
      /\bmeds?\b/i,
      /\bvet\b/i,
      /\bveterinary\b/i,
      /\bvaccine\b/i,
      /\bvitamins?\b/i,
      /\bantibiotics?\b/i,
      /\btreatment\b/i,
    ],
  },
  {
    quickCategory: "Labor",
    fundingNature: "OPEX",
    category: "Labor",
    patterns: [
      /\blabo[u]?r\b/i,
      /\bsweldo\b/i,
      /\bsahod\b/i,
      /\bwages?\b/i,
      /\bsalar(?:y|ies)\b/i,
      /\bworker\b/i,
      /\bhelper\b/i,
      /\bcaretaker\b/i,
      /\bpayroll\b/i,
    ],
  },
  {
    quickCategory: "Repairs and Maintenance",
    fundingNature: "OPEX",
    category: "Minor Repair",
    patterns: [
      /\brepairs?\b/i,
      /\bpaayo\b/i,
      /\bgipaayo\b/i,
      /\binayo\b/i,
      /\bmaintenance\b/i,
      /\bfix(?:ed|ing)?\b/i,
      /\bnails?\b/i,
      /\bcarpenter\b/i,
      /\bwelding\b/i,
    ],
  },
  {
    quickCategory: "Repairs and Maintenance",
    fundingNature: "CAPEX",
    category: "Building Repair",
    patterns: [
      /\bbuilding repair\b/i,
      /\bpoultry house\b/i,
      /\brenovation\b/i,
      /\bconstruction\b/i,
      /\broof(?:ing)?\b/i,
    ],
  },
  {
    quickCategory: "Supplies",
    fundingNature: "CAPEX",
    category: "Hardware",
    patterns: [
      /\bhardware\b/i,
      /\blumber\b/i,
      /\bplywood\b/i,
      /\bwood\b/i,
      /\bcement\b/i,
    ],
  },
  {
    quickCategory: "Utilities",
    fundingNature: "OPEX",
    category: "Utilities",
    patterns: [
      /\belectric(?:ity)?\b/i,
      /\bkuryente\b/i,
      /\btubig\b/i,
      /\bpower\b/i,
      /\bwater\b/i,
      /\butilit(?:y|ies)\b/i,
      /\bbill\b/i,
      /\binternet\b/i,
    ],
  },
  {
    quickCategory: "Transport",
    fundingNature: "OPEX",
    category: "Transport",
    patterns: [
      /\btransport\b/i,
      /\bplete\b/i,
      /\bhatod\b/i,
      /\bbiyahe\b/i,
      /\bdelivery\b/i,
      /\bfare\b/i,
      /\btruck(?:ing)?\b/i,
      /\bfuel\b/i,
      /\bdiesel\b/i,
      /\bgasoline\b/i,
      /\bparking\b/i,
    ],
  },
  {
    quickCategory: "Supplies",
    fundingNature: "OPEX",
    category: "Supplies",
    patterns: [
      /\bsupplies\b/i,
      /\bgamit\b/i,
      /\bdisinfectant\b/i,
      /\bcleaning\b/i,
      /\bgloves?\b/i,
      /\bsacks?\b/i,
      /\btrays?\b/i,
      /\bbedding\b/i,
      /\bstraw\b/i,
    ],
  },
  {
    quickCategory: "Equipment",
    fundingNature: "CAPEX",
    category: "Equipment",
    patterns: [
      /\bequipment\b/i,
      /\bcages?\b/i,
      /\bfeeders?\b/i,
      /\bdrinkers?\b/i,
      /\bbrooders?\b/i,
      /\bincubators?\b/i,
      /\bfans?\b/i,
      /\btools?\b/i,
      /\bscale\b/i,
    ],
  },
];

const EXPENSE_PATTERNS = [
  /\bbought\b/i,
  /\bnipalit\b/i,
  /\bnagpalit\b/i,
  /\bgipalit\b/i,
  /\bbumili\b/i,
  /\bbinili\b/i,
  /\bbuy\b/i,
  /\bpurchased\b/i,
  /\bpaid\b/i,
  /\bnagbayad\b/i,
  /\bmayad\b/i,
  /\bbinayad\b/i,
  /\bspent\b/i,
  /\bcost\b/i,
  /\bexpense\b/i,
];

const REVENUE_PATTERNS = [
  /\bsold\b/i,
  /\bbaligya\b/i,
  /\bhalin\b/i,
  /\bnakabaligya\b/i,
  /\bsale\b/i,
  /\bsales\b/i,
  /\breceived\b/i,
  /\bincome\b/i,
  /\brevenue\b/i,
  /\bearned\b/i,
];

function parseQuickEntry(text, options = {}) {
  const originalText = String(text || "").trim();
  const today = options.today || toLocalDate(new Date());
  const amountResult = extractAmount(originalText);
  const type = inferTransactionType(originalText);
  const categoryMatch = inferCategory(originalText, type);
  const description = buildDescription(originalText, amountResult);
  const confidence = scoreConfidence({
    originalText,
    amountResult,
    category: categoryMatch.category,
    description,
  });

  return {
    type,
    transactionType: type,
    fundingNature: categoryMatch.fundingNature,
    category: categoryMatch.category,
    quickCategory: categoryMatch.quickCategory,
    description,
    amount: amountResult.amount,
    currency: amountResult.currency,
    paymentMethod: "Cash",
    building: options.building || "All",
    paidBy: options.paidBy || "Rolly",
    paidTo: options.paidTo || "",
    reference: "",
    remarks: "",
    date: inferDate(originalText, today),
    confidence,
    originalText,
  };
}

function quickEntryResponse(text, options = {}) {
  const parsed = parseQuickEntry(text, options);
  return {
    parsed: {
      type: parsed.type,
      transactionType: parsed.transactionType,
      fundingNature: parsed.fundingNature,
      category: parsed.category,
      quickCategory: parsed.quickCategory,
      description: parsed.description,
      amount: parsed.amount,
      currency: parsed.currency,
      paymentMethod: parsed.paymentMethod,
      building: parsed.building,
      paidBy: parsed.paidBy,
      paidTo: parsed.paidTo,
      reference: parsed.reference,
      remarks: parsed.remarks,
      date: parsed.date,
      confidence: parsed.confidence,
      originalText: parsed.originalText,
    },
    needsReview: parsed.confidence < 0.75 || parsed.amount == null,
  };
}

function extractAmount(text) {
  const compactAmount = /(?:php|₱|p)\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i.exec(text);
  const wordCurrencyAmount = /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:pesos?|php|₱)\b/i.exec(text);
  const plainAmount = /(?:about|around|roughly|approximately|for|cost(?:s|ed)?|paid|spent)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i.exec(text);
  const match = compactAmount || wordCurrencyAmount || plainAmount;

  if (!match) {
    return { amount: null, currency: "PHP", raw: "" };
  }

  return {
    amount: Number(match[1].replace(/,/g, "")),
    currency: inferCurrency(text),
    raw: match[0],
  };
}

function inferCurrency(text) {
  if (/\b(?:peso|pesos|php)\b|₱/i.test(text)) {
    return "PHP";
  }

  return "PHP";
}

function inferTransactionType(text) {
  if (REVENUE_PATTERNS.some((pattern) => pattern.test(text))) {
    return "Income";
  }

  if (EXPENSE_PATTERNS.some((pattern) => pattern.test(text))) {
    return "Expense";
  }

  return "Expense";
}

function inferCategory(text, transactionType) {
  const matchingRule = CATEGORY_RULES.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(text)),
  );

  if (matchingRule) {
    return matchingRule;
  }

  if (transactionType === "Income") {
    return {
      quickCategory: "Other Revenue",
      fundingNature: "Revenue",
      category: "Miscellaneous Income",
    };
  }

  return {
    quickCategory: "Other Expense",
    fundingNature: "OPEX",
    category: "Miscellaneous",
  };
}

function buildDescription(text, amountResult) {
  let description = text
    .replace(/\b(?:bought|buy|purchased|paid|spent|for|about|around|roughly|approximately)\b/gi, " ")
    .replace(/\b(?:nipalit|nagpalit|gipalit|bumili|binili|nagbayad|mayad|binayad|kog|ko|ako|ng|sa|para|pang|mga|around|approx)\b/gi, " ")
    .replace(/\b(?:cash|gcash|bank|card|credit|debit)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (amountResult.raw) {
    description = description.replace(amountResult.raw, " ");
  }

  description = description
    .replace(/\b(?:pesos?|php)\b/gi, " ")
    .replace(/₱/g, " ")
    .replace(/[.,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  description = normalizeLocalTerms(description);

  if (!description) {
    return "Unspecified transaction";
  }

  return toTitleCase(description);
}

function normalizeLocalTerms(text) {
  return text
    .replace(/\bkahoy\b/gi, "wood")
    .replace(/\btambal\b/gi, "medicine")
    .replace(/\bgamot\b/gi, "medicine")
    .replace(/\bpakaon\b/gi, "feed")
    .replace(/\bsweldo\b/gi, "labor pay")
    .replace(/\bsahod\b/gi, "labor pay")
    .replace(/\bkuryente\b/gi, "electricity")
    .replace(/\btubig\b/gi, "water")
    .replace(/\bplete\b/gi, "fare")
    .replace(/\bpaayo\b/gi, "repair")
    .replace(/\s+/g, " ")
    .trim();
}

function inferDate(text, today) {
  if (/\byesterday\b/i.test(text)) {
    const date = new Date(`${today}T00:00:00`);
    date.setDate(date.getDate() - 1);
    return toLocalDate(date);
  }

  const isoDate = /\b(20[0-9]{2}-[01][0-9]-[0-3][0-9])\b/.exec(text);
  if (isoDate) {
    return isoDate[1];
  }

  return today;
}

function scoreConfidence({ originalText, amountResult, category, description }) {
  let score = 0.45;

  if (amountResult.amount != null) {
    score += 0.25;
  }

  if (category !== "Miscellaneous" && category !== "Miscellaneous Income") {
    score += 0.12;
  }

  if (description && description !== "Unspecified transaction") {
    score += 0.08;
  }

  if (/\babout|around|roughly|approximately\b/i.test(originalText)) {
    score -= 0.04;
  }

  return Math.max(0.01, Math.min(0.99, Number(score.toFixed(2))));
}

function toTitleCase(text) {
  return text
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function toLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = {
  categories,
  octavioLedgerCategories,
  groupOctavioCategories,
  parseQuickEntry,
  quickEntryResponse,
};
