const entryForm = document.querySelector("#entry-form");
const reviewForm = document.querySelector("#review-form");
const reviewStatus = document.querySelector("#review-status");
const confidence = document.querySelector("#confidence");
const jsonOutput = document.querySelector("#json-output");
const parserNote = document.querySelector("#parser-note");
const fundingSelect = document.querySelector("#funding-select");
const categorySelect = document.querySelector("#category-select");

let latestParsed = null;
let categoriesByFunding = {};

init();

async function init() {
  const payload = await fetch("/api/categories")
    .then((response) => response.json())
  categoriesByFunding = payload.categoriesByFunding || {};

  fundingSelect.innerHTML = Object.keys(categoriesByFunding)
    .map((fundingNature) => `<option>${fundingNature}</option>`)
    .join("");
  renderCategoryOptions(fundingSelect.value);

  entryForm.addEventListener("submit", parseEntry);
  reviewForm.addEventListener("submit", confirmEntry);
  reviewForm.addEventListener("input", updateJsonFromForm);
  fundingSelect.addEventListener("change", () => {
    renderCategoryOptions(fundingSelect.value);
    updateJsonFromForm();
  });
}

async function parseEntry(event) {
  event.preventDefault();
  reviewStatus.textContent = "Parsing";

  const text = new FormData(entryForm).get("entryText");
  const response = await fetch("/api/quick-entry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const payload = await response.json();

  if (!response.ok) {
    reviewStatus.textContent = payload.error || "Could not parse";
    return;
  }

  latestParsed = payload.parsed;
  fillReviewForm(latestParsed);
  reviewStatus.textContent = payload.needsReview ? "Needs review" : "Ready";
  confidence.textContent = `${formatParserMode(payload.parserMode)} confidence ${Math.round(latestParsed.confidence * 100)}%`;
  parserNote.textContent = payload.parserWarning || "";
  renderJson(latestParsed);
}

async function confirmEntry(event) {
  event.preventDefault();
  const parsed = readReviewForm();

  reviewStatus.textContent = "Sending";
  const response = await fetch("/api/confirmed-entry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ parsed }),
  });

  const payload = await response.json();
  reviewStatus.textContent = response.ok ? "Confirmed" : payload.error || "Send failed";
  renderJson(payload.entry || parsed);
}

function fillReviewForm(parsed) {
  for (const [key, value] of Object.entries(parsed)) {
    const field = reviewForm.elements[key];
    if (field) {
      field.value = value ?? "";
    }
  }

  if (parsed.fundingNature) {
    fundingSelect.value = parsed.fundingNature;
    renderCategoryOptions(parsed.fundingNature);
  }

  if (parsed.category) {
    categorySelect.value = parsed.category;
  }
}

function readReviewForm() {
  const data = Object.fromEntries(new FormData(reviewForm).entries());
  return {
    ...latestParsed,
    ...data,
    amount: data.amount ? Number(data.amount) : null,
    quantity: data.quantity ? Number(data.quantity) : null,
    unitPrice: data.unitPrice ? Number(data.unitPrice) : null,
    amountSource: data.amountSource || null,
    confidence: latestParsed?.confidence ?? null,
  };
}

function updateJsonFromForm() {
  renderJson(readReviewForm());
}

function renderJson(value) {
  jsonOutput.textContent = JSON.stringify(value, null, 2);
}

function renderCategoryOptions(fundingNature) {
  categorySelect.innerHTML = (categoriesByFunding[fundingNature] || [])
    .map((category) => `<option>${category}</option>`)
    .join("");
}

function formatParserMode(parserMode) {
  if (parserMode === "gemini") return "Gemini AI";
  if (parserMode === "openai") return "OpenAI";
  return "Rules";
}
