# Farm Quick Entry

Natural-language transaction capture for a poultry/farm ledger. Users type or speak a short entry, the backend parses it into structured JSON, and the review UI lets them confirm or edit before the app forwards the clean entry to your real backend.

## Run

```bash
npm start
```

Open `http://localhost:3000`.

## Test

```bash
npm test
```

## Parse endpoint

`POST /api/quick-entry`

```json
{
  "text": "bought wood repair for about 400 pesos"
}
```

Response:

```json
{
  "parsed": {
    "type": "Expense",
    "transactionType": "Expense",
    "fundingNature": "OPEX",
    "category": "Minor Repair",
    "quickCategory": "Repairs and Maintenance",
    "description": "Wood Repair",
    "amount": 400,
    "quantity": null,
    "unit": "",
    "unitPrice": null,
    "amountSource": "estimated",
    "currency": "PHP",
    "paymentMethod": "Cash",
    "building": "All",
    "paidBy": "Rolly",
    "paidTo": "",
    "reference": "",
    "remarks": "",
    "date": "2026-05-14",
    "confidence": 0.86,
    "originalText": "bought wood repair for about 400 pesos"
  },
  "needsReview": false
}
```

## AI parser

The app uses Google AI Studio / Gemini when `GEMINI_API_KEY` is set. If Gemini is not configured, it can use OpenAI when `OPENAI_API_KEY` is set. If neither key is configured, it falls back to the local rules parser.

It is designed for Bisaya/Cebuano, Tagalog/Filipino, English, and mixed entries such as:

```text
nipalit kog kahoy pang repair mga 400 pesos
nagbayad sweldo sa helper 500 pesos
bumili ng gamot pang manok 350 pesos
halin sa manok 12000 pesos
```

Configure it with:

```powershell
$env:GEMINI_API_KEY="your-google-ai-studio-key"
$env:GEMINI_MODEL="gemini-2.5-flash"
npm start
```

If the AI request fails or no AI key is configured, the backend automatically falls back to the local rules parser and includes `parserMode` plus `parserWarning` in the response.

The AI output is constrained to Octavio ledger fields and allowed category pairs before it reaches the review UI.

Amount fields:

- `quantity`: count stated by the user, such as `2`
- `unit`: normalized unit, such as `sack`, `kg`, `piece`, or `tray`
- `unitPrice`: price per unit when stated
- `amount`: explicit total or calculated `quantity * unitPrice`
- `amountSource`: `explicit`, `quantity_x_unit_price`, or `estimated`

Examples:

```text
bought 2 sacks feeds at 1500 pesos each
```

Returns `quantity: 2`, `unit: "sack"`, `unitPrice: 1500`, `amount: 3000`, and `amountSource: "quantity_x_unit_price"`.

```text
bought 2 sacks feeds at 1500 each total 2900 pesos
```

Keeps the explicit total as `amount: 2900` and `amountSource: "explicit"`.

Category guard:

- `sold empty sacks 300 pesos` maps to `Income / Revenue / Empty Sack Sale`
- `bought sacks 300 pesos` maps to `Expense / OPEX / Supplies`

## Confirmed entries

This app is based on the current public shapes of:

- Frontend: `https://github.com/rckieee-gif/R`
- Backend: `https://github.com/rckieee-gif/Octavio-Poultry-farms`

The Octavio backend already saves ledger entries through `POST /api/batches/:batchId/transactions`, so this quick-entry app prepares the same payload shape and keeps the user review step before forwarding.

The review UI posts confirmed entries to `POST /api/confirmed-entry`. This app does not write directly to a database. To forward confirmed entries to any full transaction endpoint URL, start the app with:

```bash
BACKEND_TRANSACTION_URL=https://your-backend.example/api/ledger-entries npm start
```

On Windows PowerShell:

```powershell
$env:BACKEND_TRANSACTION_URL="https://your-backend.example/api/ledger-entries"; npm start
```

For the Octavio backend specifically, use:

```powershell
$env:OCTAVIO_API_BASE="https://octavio-poultry-farms.onrender.com"
$env:OCTAVIO_BATCH_ID="20260514"
$env:OCTAVIO_TOKEN="your-login-token"
npm start
```

Confirmed entries will be posted to:

```text
POST /api/batches/:batchId/transactions
```

Payload fields prepared for Octavio:

```json
{
  "batchId": "20260514",
  "date": "2026-05-14",
  "building": "All",
  "type": "Expense",
  "fundingNature": "OPEX",
  "category": "Minor Repair",
  "description": "Wood Repair",
  "quantity": null,
  "unitCost": null,
  "amount": 400,
  "paidBy": "Rolly",
  "paidTo": "",
  "reference": "",
  "remarks": "Quick entry: bought wood repair for about 400 pesos",
  "feedItemId": null
}
```

## Supported categories

Quick-entry labels:

- Feeds
- Medicine / Vet
- Labor
- Repairs and Maintenance
- Utilities
- Transport
- Supplies
- Equipment
- Sales Revenue
- Other Expense
- Other Revenue

Octavio ledger categories are also exposed through `GET /api/categories` as `categoriesByFunding`, matching the backend seed categories such as `OPEX / Feed`, `OPEX / Minor Repair`, `CAPEX / Building Repair`, and `Revenue / Net Meat Sale`.
