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
    allowedTypes: ["Income"],
    patterns: [/\bempty sacks?\b/i, /\bsacks?\b/i],
  },
  {
    quickCategory: "Sales Revenue",
    fundingNature: "Revenue",
    category: "Net Meat Sale",
    allowedTypes: ["Income"],
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
      /\bmanok\b/i,
    ],
  },
  {
    quickCategory: "Feeds",
    fundingNature: "OPEX",
    category: "Feed",
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
    allowedTypes: ["Expense"],
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
  const description = buildDescription(originalText, amountResult, categoryMatch);
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
    quantity: amountResult.quantity,
    unit: amountResult.unit,
    unitPrice: amountResult.unitPrice,
    amountSource: amountResult.amountSource,
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
      quantity: parsed.quantity,
      unit: parsed.unit,
      unitPrice: parsed.unitPrice,
      amountSource: parsed.amountSource,
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
  const quantityResult = extractQuantityAndUnitPrice(text);
  const explicitResult = extractExplicitAmount(text, quantityResult);
  const isEstimated = hasEstimateMarker(text);
  const currency = inferCurrency(text);

  if (explicitResult.amount != null) {
    return {
      amount: explicitResult.amount,
      quantity: quantityResult.quantity,
      unit: quantityResult.unit,
      unitPrice: quantityResult.unitPrice,
      amountSource: isEstimated ? "estimated" : "explicit",
      currency,
      raw: joinRaw(quantityResult.raw, explicitResult.raw),
    };
  }

  if (quantityResult.quantity != null && quantityResult.unitPrice != null) {
    return {
      amount: Number((quantityResult.quantity * quantityResult.unitPrice).toFixed(2)),
      quantity: quantityResult.quantity,
      unit: quantityResult.unit,
      unitPrice: quantityResult.unitPrice,
      amountSource: isEstimated ? "estimated" : "quantity_x_unit_price",
      currency,
      raw: quantityResult.raw,
    };
  }

  return {
    amount: null,
    quantity: quantityResult.quantity,
    unit: quantityResult.unit,
    unitPrice: quantityResult.unitPrice,
    amountSource: isEstimated ? "estimated" : null,
    currency,
    raw: quantityResult.raw || "",
  };
}

function inferCurrency(text) {
  if (/\b(?:peso|pesos|php)\b|\u20b1/i.test(text)) {
    return "PHP";
  }

  return "PHP";
}

function inferTransactionType(text) {
  const hasRevenueSignal = REVENUE_PATTERNS.some((pattern) => pattern.test(text));
  const hasExpenseSignal = EXPENSE_PATTERNS.some((pattern) => pattern.test(text));

  if (hasRevenueSignal && !hasExpenseSignal) {
    return "Income";
  }

  if (hasExpenseSignal) {
    return "Expense";
  }

  return "Expense";
}

function inferCategory(text, transactionType) {
  const matchingRule = CATEGORY_RULES.find((rule) =>
    (!rule.allowedTypes || rule.allowedTypes.includes(transactionType)) &&
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

function buildDescription(text, amountResult, categoryMatch = null) {
  let description = text
    .replace(/\b(?:bought|buy|purchased|paid|spent|for|about|around|roughly|approximately|total|amount|cost(?:s|ed)?)\b/gi, " ")
    .replace(/\b(?:nipalit|nagpalit|gipalit|bumili|binili|nagbayad|mayad|binayad|kog|ko|ako|ng|sa|para|pang|mga|around|approx)\b/gi, " ")
    .replace(/\b(?:cash|gcash|bank|card|credit|debit)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (amountResult.raw) {
    for (const rawPart of splitRawParts(amountResult.raw)) {
      description = description.replace(rawPart, " ");
    }
  }

  description = description
    .replace(/\b(?:pesos?|php|each|per|at|x|@)\b/gi, " ")
    .replace(/\u20b1/g, " ")
    .replace(/[.,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  description = normalizeLocalTerms(description);

  if (!description) {
    return categoryMatch?.category && categoryMatch.category !== "Miscellaneous"
      ? categoryMatch.category
      : "Unspecified transaction";
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

  if (amountResult.amountSource === "quantity_x_unit_price") {
    score += 0.04;
  }

  if (category !== "Miscellaneous" && category !== "Miscellaneous Income") {
    score += 0.12;
  }

  if (description && description !== "Unspecified transaction") {
    score += 0.08;
  }

  if (amountResult.amountSource === "estimated" || hasEstimateMarker(originalText)) {
    score -= 0.04;
  }

  return Math.max(0.01, Math.min(0.99, Number(score.toFixed(2))));
}

function extractExplicitAmount(text, quantityResult) {
  const explicitPatterns = [
    /\b(?:total|subtotal|amount|paid|cost(?:s|ed)?|for)\s*(?:php|\u20b1|p)?\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?:\s*(?:pesos?|php))?\b/i,
    /(?:php|\u20b1)\s*([0-9][0-9,]*(?:\.[0-9]+)?)(?!\s*(?:each|ea|per|\/))/i,
    /\b([0-9][0-9,]*(?:\.[0-9]+)?)\s*(?:pesos?|php)\b(?!\s*(?:each|ea|per|\/))/i,
  ];

  for (const pattern of explicitPatterns) {
    const match = pattern.exec(text);
    if (match && !overlapsQuantityPrice(match[0], quantityResult.raw)) {
      return {
        amount: parseNumber(match[1]),
        raw: match[0],
      };
    }
  }

  const numbers = [...text.matchAll(/\b[0-9][0-9,]*(?:\.[0-9]+)?\b/g)];
  if (numbers.length === 1 && quantityResult.quantity == null && quantityResult.unitPrice == null) {
    return {
      amount: parseNumber(numbers[0][0]),
      raw: numbers[0][0],
    };
  }

  return { amount: null, raw: "" };
}

function extractQuantityAndUnitPrice(text) {
  const unitPattern = "(sacks?|bags?|pcs?|pieces?|kilos?|kgs?|kg|liters?|litres?|ltr|bottles?|packs?|trays?|boxes?)";
  const itemWords = "(?:\\s+(?!x\\b|at\\b|per\\b)[a-zA-Z]+){0,4}";
  const quantityWithPricePatterns = [
    new RegExp(`\\b([0-9][0-9,]*(?:\\.[0-9]+)?)\\s*${unitPattern}${itemWords}\\s*(?:x|@|at|per)\\s*(?:php|\\u20b1|p)?\\s*([0-9][0-9,]*(?:\\.[0-9]+)?)(?:\\s*(?:pesos?|php))?(?:\\s*(?:each|ea))?\\b`, "i"),
    new RegExp(`\\b([0-9][0-9,]*(?:\\.[0-9]+)?)\\s*${unitPattern}${itemWords}\\s*(?:php|\\u20b1|p)\\s*([0-9][0-9,]*(?:\\.[0-9]+)?)(?:\\s*(?:each|ea))?\\b`, "i"),
  ];

  for (const pattern of quantityWithPricePatterns) {
    const match = pattern.exec(text);
    if (match) {
      return {
        quantity: parseNumber(match[1]),
        unit: normalizeUnit(match[2]),
        unitPrice: parseNumber(match[3]),
        raw: match[0],
      };
    }
  }

  const quantityOnly = new RegExp(`\\b([0-9][0-9,]*(?:\\.[0-9]+)?)\\s*${unitPattern}\\b`, "i").exec(text);
  if (quantityOnly) {
    return {
      quantity: parseNumber(quantityOnly[1]),
      unit: normalizeUnit(quantityOnly[2]),
      unitPrice: null,
      raw: quantityOnly[0],
    };
  }

  return {
    quantity: null,
    unit: "",
    unitPrice: null,
    raw: "",
  };
}

function parseNumber(value) {
  return Number(String(value || "").replace(/,/g, ""));
}

function normalizeUnit(value) {
  const unit = String(value || "").toLowerCase();
  const unitMap = {
    sack: "sack",
    sacks: "sack",
    bag: "bag",
    bags: "bag",
    pc: "piece",
    pcs: "piece",
    piece: "piece",
    pieces: "piece",
    kilo: "kg",
    kilos: "kg",
    kg: "kg",
    kgs: "kg",
    liter: "liter",
    liters: "liter",
    litre: "liter",
    litres: "liter",
    ltr: "liter",
    bottle: "bottle",
    bottles: "bottle",
    pack: "pack",
    packs: "pack",
    tray: "tray",
    trays: "tray",
    box: "box",
    boxes: "box",
  };

  return unitMap[unit] || unit;
}

function hasEstimateMarker(text) {
  return /\b(?:about|around|roughly|approximately|approx|mga|murag|siguro|estimate|estimated)\b/i.test(text);
}

function overlapsQuantityPrice(explicitRaw, quantityRaw) {
  if (!explicitRaw || !quantityRaw) {
    return false;
  }

  return quantityRaw.toLowerCase().includes(explicitRaw.toLowerCase());
}

function joinRaw(...parts) {
  return parts.filter(Boolean).join(" ");
}

function splitRawParts(raw) {
  return raw
    .split(/\s{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
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
