const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Bookings";
const MAX_REQUEST_BYTES = 10000;
const PRODUCTS = {
  "yellow-white-set": "Yellow & white set",
  "pink-yellow-set": "Pink & yellow set",
  "sky-blue-white-set": "Sky-blue & white set",
  "green-twinning-set": "Green twinning set",
  "kids-vest-7-8": "Kids vest 7-8 years",
  "kids-vest-1-2": "Kids vest 1-2 years"
};
const HEADERS = [
  "Received at",
  "Reference",
  "Name",
  "Instagram ID",
  "Set",
  "Date needed",
  "May tag in shared photos"
];

function doPost(event) {
  try {
    const request = parseRequest_(event);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getBookingsSheet_();
      const referenceCell = sheet
        .getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1)
        .createTextFinder(request.reference)
        .matchEntireCell(true)
        .findNext();

      if (referenceCell) {
        return jsonResponse_({ ok: true, duplicate: true });
      }

      sheet.appendRow([
        new Date(),
        sheetSafeText_(request.reference),
        sheetSafeText_(request.name),
        sheetSafeText_(request.instagram),
        sheetSafeText_(request.productName),
        sheetSafeText_(request.date),
        request.mayTag ? "Yes" : "No"
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error("Booking POST rejected or could not be saved: " + error.message);
    return jsonResponse_({ ok: false, error: error.message });
  }
}

function parseRequest_(event) {
  if (!event || !event.postData || typeof event.postData.contents !== "string") {
    throw new Error("Missing request body.");
  }
  if (Utilities.newBlob(event.postData.contents).getBytes().length > MAX_REQUEST_BYTES) {
    throw new Error("Request is too large.");
  }

  let data;
  try {
    data = JSON.parse(event.postData.contents);
  } catch (error) {
    throw new Error("Request body must be valid JSON.");
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Request body must be a JSON object.");
  }

  const reference = cleanText_(data.reference, 20, "Reference");
  const name = cleanText_(data.name, 100, "Name");
  const instagram = cleanText_(data.instagram || "", 60, "Instagram ID");
  const productId = cleanText_(data.productId, 60, "Set");
  const date = cleanText_(data.date, 10, "Date needed");

  if (!/^KB-\d{6}-[A-F0-9]{4}$/.test(reference)) {
    throw new Error("Reference format is invalid.");
  }
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, productId)) {
    throw new Error("Selected set is not recognized.");
  }
  if (data.productName !== PRODUCTS[productId]) {
    throw new Error("Selected set name does not match its ID.");
  }
  if (!isValidDate_(date)) {
    throw new Error("Date needed must be a valid date from today onward.");
  }
  if (typeof data.mayTag !== "boolean") {
    throw new Error("Photo-tag preference must be true or false.");
  }

  return {
    reference: reference,
    name: name,
    instagram: instagram,
    productName: PRODUCTS[productId],
    date: date,
    mayTag: data.mayTag
  };
}

function cleanText_(value, maxLength, label) {
  if (typeof value !== "string") {
    throw new Error(label + " must be text.");
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  if (cleaned.length > maxLength) {
    throw new Error(label + " is too long.");
  }
  return cleaned;
}

function isValidDate_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + "T00:00:00Z");
  if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return false;
  }
  const today = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");
  return value >= today;
}

function getBookingsSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    throw new Error("Set SPREADSHEET_ID in Code.gs before deploying.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0].join("\t") !== HEADERS.join("\t")) {
    throw new Error("The Bookings sheet has unexpected headers. Keep or restore the required header row.");
  }
  return sheet;
}

function sheetSafeText_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
