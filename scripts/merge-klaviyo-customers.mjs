import fs from "fs";
import path from "path";

const INPUT_FILES = [
  "c:/Users/Flexdesigns/Downloads/customers_export (8).csv",
  "c:/Users/Flexdesigns/Downloads/customers_export (7).csv",
];

const OUTPUT_SHOPIFY = "c:/Users/Flexdesigns/agentroom/meneer-marketing-web/shopify/exports/skincomplete-customers-merged.csv";
const OUTPUT_KLAVIYO = "c:/Users/Flexdesigns/agentroom/meneer-marketing-web/shopify/exports/skincomplete-klaviyo-import.csv";
const FORCE_EMAIL_CONSENT = true;

function parseCSV(text) {
  const rows = [];
  let i = 0;
  let field = "";
  let row = [];
  let inQuotes = false;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 2;
        continue;
      }
      if (char === '"') {
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (char === "\r") {
      i += 1;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function escapeCSV(value) {
  const str = value ?? "";
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(headers, records) {
  const lines = [headers.map(escapeCSV).join(",")];
  for (const record of records) {
    lines.push(headers.map((header) => escapeCSV(record[header] ?? "")).join(","));
  }
  return `\uFEFF${lines.join("\n")}\n`;
}

function normalizePhone(phone) {
  const digits = (phone ?? "").replace(/\s/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+31${digits.slice(1)}`;
  return digits;
}

const byCustomerId = new Map();
let shopifyHeaders = null;

for (const filePath of INPUT_FILES) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const rows = parseCSV(text);
  const headers = rows[0];
  shopifyHeaders = shopifyHeaders ?? headers;

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    const record = Object.fromEntries(headers.map((header, idx) => [header, row[idx] ?? ""]));
    const customerId = record["Customer ID"]?.trim();
    if (!customerId) continue;
    byCustomerId.set(customerId, record);
  }
}

const mergedShopify = [...byCustomerId.values()].sort((a, b) => {
  const aName = `${a["Last Name"]} ${a["First Name"]}`.toLowerCase();
  const bName = `${b["Last Name"]} ${b["First Name"]}`.toLowerCase();
  return aName.localeCompare(bName, "nl");
});

fs.writeFileSync(OUTPUT_SHOPIFY, toCSV(shopifyHeaders, mergedShopify), "utf8");

const klaviyoHeaders = [
  "Email",
  "First Name",
  "Last Name",
  "Phone Number",
  "Shopify Customer ID",
  "Accepts Email Marketing",
  "Total Spent",
  "Total Orders",
  "City",
  "Country",
  "Zip",
  "$consent",
];

const klaviyoRecords = mergedShopify
  .filter((record) => record.Email?.trim())
  .map((record) => {
    const acceptsEmail =
      FORCE_EMAIL_CONSENT ||
      (record["Accepts Email Marketing"] ?? "").toLowerCase() === "yes";
    const phone = normalizePhone(record.Phone || record["Default Address Phone"]);

    return {
      Email: record.Email.trim().toLowerCase(),
      "First Name": record["First Name"]?.trim() ?? "",
      "Last Name": record["Last Name"]?.trim() ?? "",
      "Phone Number": phone,
      "Shopify Customer ID": record["Customer ID"]?.trim() ?? "",
      "Accepts Email Marketing": acceptsEmail ? "yes" : "no",
      "Total Spent": record["Total Spent"]?.trim() ?? "",
      "Total Orders": record["Total Orders"]?.trim() ?? "",
      City: record["Default Address City"]?.trim() ?? "",
      Country: record["Default Address Country Code"]?.trim() ?? "",
      Zip: record["Default Address Zip"]?.trim() ?? "",
      $consent: acceptsEmail ? "email" : "",
    };
  })
  .sort((a, b) => a.Email.localeCompare(b.Email));

fs.writeFileSync(OUTPUT_KLAVIYO, toCSV(klaviyoHeaders, klaviyoRecords), "utf8");

console.log(`Merged Shopify export: ${mergedShopify.length} customers`);
console.log(`Klaviyo import file: ${klaviyoRecords.length} profiles with email`);
console.log(`Email consent (yes): ${klaviyoRecords.filter((r) => r["Accepts Email Marketing"] === "yes").length}`);
console.log(`Written to:\n- ${OUTPUT_SHOPIFY}\n- ${OUTPUT_KLAVIYO}`);
