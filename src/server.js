const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  categories,
  octavioLedgerCategories,
  groupOctavioCategories,
} = require("./parser");
const { parseQuickEntryWithAi } = require("./aiParser");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const BACKEND_TRANSACTION_URL = process.env.BACKEND_TRANSACTION_URL || "";
const OCTAVIO_API_BASE = process.env.OCTAVIO_API_BASE || "";
const OCTAVIO_BATCH_ID = process.env.OCTAVIO_BATCH_ID || "";
const OCTAVIO_TOKEN = process.env.OCTAVIO_TOKEN || "";

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      return serveFile(res, path.join(PUBLIC_DIR, "index.html"), "text/html; charset=utf-8");
    }

    if (req.method === "GET" && req.url === "/app.js") {
      return serveFile(res, path.join(PUBLIC_DIR, "app.js"), "text/javascript; charset=utf-8");
    }

    if (req.method === "GET" && req.url === "/styles.css") {
      return serveFile(res, path.join(PUBLIC_DIR, "styles.css"), "text/css; charset=utf-8");
    }

    if (req.method === "GET" && req.url === "/api/categories") {
      return sendJson(res, 200, {
        categories,
        quickEntryCategories: categories,
        octavioLedgerCategories,
        categoriesByFunding: groupOctavioCategories(),
      });
    }

    if (req.method === "POST" && req.url === "/api/quick-entry") {
      const body = await readJsonBody(req);

      if (!body.text || typeof body.text !== "string") {
        return sendJson(res, 400, { error: "Request body must include a text field." });
      }

      const result = await parseQuickEntryWithAi(body.text, {
        today: body.today,
        building: body.building,
        paidBy: body.paidBy,
      });

      return sendJson(res, 200, {
        parsed: result.parsed,
        needsReview: result.parsed.confidence < 0.75 || result.parsed.amount == null,
        parserMode: result.parserMode,
        parserWarning: result.parserWarning,
      });
    }

    if (req.method === "POST" && req.url === "/api/confirmed-entry") {
      const body = await readJsonBody(req);

      if (!body.parsed || typeof body.parsed !== "object") {
        return sendJson(res, 400, { error: "Request body must include a parsed transaction." });
      }

      const forwardUrl = getForwardUrl(body);
      const ledgerPayload = toOctavioPayload(body.parsed, body.batchId);

      if (!forwardUrl) {
        return sendJson(res, 202, {
          queued: false,
          message: "Parsed entry accepted for review. Set BACKEND_TRANSACTION_URL or OCTAVIO_API_BASE plus OCTAVIO_BATCH_ID to forward confirmed entries.",
          entry: ledgerPayload,
        });
      }

      const headers = { "content-type": "application/json" };
      if (OCTAVIO_TOKEN) {
        headers.authorization = `Bearer ${OCTAVIO_TOKEN}`;
      }

      const backendResponse = await fetch(forwardUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(ledgerPayload),
      });

      const responseText = await backendResponse.text();
      return sendJson(res, backendResponse.ok ? 200 : 502, {
        forwarded: backendResponse.ok,
        backendStatus: backendResponse.status,
        backendResponse: responseText,
      });
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Quick-entry app listening on http://localhost:${PORT}`);
});

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      return sendJson(res, 404, { error: "Not found" });
    }

    res.writeHead(200, { "content-type": contentType });
    res.end(content);
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON request body."));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "content-type": "application/json" });
  res.end(JSON.stringify(payload, null, 2));
}

function getForwardUrl(body) {
  if (BACKEND_TRANSACTION_URL) {
    return BACKEND_TRANSACTION_URL;
  }

  const batchId = body.batchId || OCTAVIO_BATCH_ID;
  if (!OCTAVIO_API_BASE || !batchId) {
    return "";
  }

  return `${OCTAVIO_API_BASE.replace(/\/$/, "")}/api/batches/${encodeURIComponent(batchId)}/transactions`;
}

function toOctavioPayload(parsed, batchId) {
  return {
    batchId: batchId || undefined,
    date: parsed.date,
    building: parsed.building || "All",
    type: parsed.type || parsed.transactionType || "Expense",
    fundingNature: parsed.fundingNature,
    category: parsed.category,
    description: parsed.description,
    amount: parsed.amount == null ? null : Number(parsed.amount),
    paidBy: parsed.paidBy || "Rolly",
    paidTo: parsed.paidTo || "",
    reference: parsed.reference || "",
    remarks: parsed.remarks || `Quick entry: ${parsed.originalText || ""}`.trim(),
    feedItemId: parsed.feedItemId || null,
  };
}
