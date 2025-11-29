const XLSX = require("xlsx");
const logger = require("./logger");

/**
 * Parse Excel file and extract email addresses
 * @param {Buffer} fileBuffer - Excel file buffer
 * @param {string} sheetName - Optional sheet name (defaults to first sheet)
 * @param {string} columnName - Column name containing emails (defaults to 'email' or first column)
 * @returns {Array<string>} Array of email addresses
 */
function parseExcelForEmails(
  fileBuffer,
  sheetName = null,
  columnName = "email"
) {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = sheetName
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    const emails = [];

    // Try to find email column
    let emailColumn = columnName.toLowerCase();
    if (data.length > 0) {
      const firstRow = data[0];
      const keys = Object.keys(firstRow);

      // Auto-detect email column if not found
      if (!firstRow[emailColumn]) {
        emailColumn =
          keys.find(
            (key) =>
              key.toLowerCase().includes("email") ||
              key.toLowerCase().includes("mail")
          ) || keys[0];
      }

      data.forEach((row) => {
        const email = row[emailColumn];
        if (email && typeof email === "string" && email.includes("@")) {
          emails.push(email.trim());
        }
      });
    }

    logger.info(`Parsed ${emails.length} emails from Excel file`);
    return emails;
  } catch (error) {
    logger.error("Error parsing Excel file:", error);
    throw error;
  }
}

/**
 * Parse Excel file and extract recipients with all their data
 * @param {Buffer} fileBuffer - Excel file buffer
 * @param {string} sheetName - Optional sheet name (defaults to first sheet)
 * @returns {Array<Object>} Array of recipient objects with all columns
 */
function parseExcelForRecipients(fileBuffer, sheetName = null) {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = sheetName
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    const recipients = [];

    if (data.length > 0) {
      data.forEach((row) => {
        // Find email column
        const keys = Object.keys(row);
        const emailKey = keys.find(
          (key) =>
            key.toLowerCase().includes("email") ||
            key.toLowerCase().includes("mail")
        );

        if (
          emailKey &&
          row[emailKey] &&
          typeof row[emailKey] === "string" &&
          row[emailKey].includes("@")
        ) {
          // Create recipient object with all row data (normalized to lowercase keys)
          const recipient = {
            email: row[emailKey].trim(),
            data: {},
          };

          // Add all other columns as template variables
          keys.forEach((key) => {
            if (
              key !== emailKey &&
              row[key] !== undefined &&
              row[key] !== null
            ) {
              // Normalize key to lowercase for template variables
              const normalizedKey = key.toLowerCase().replace(/\s+/g, "_");
              recipient.data[normalizedKey] = String(row[key]).trim();
            }
          });

          // Add common fields with original case
          if (row.name) recipient.data.name = String(row.name).trim();
          if (row.Name) recipient.data.name = String(row.Name).trim();
          if (row.firstname || row["first name"])
            recipient.data.firstname = String(
              row.firstname || row["first name"]
            ).trim();
          if (row.lastname || row["last name"])
            recipient.data.lastname = String(
              row.lastname || row["last name"]
            ).trim();

          recipients.push(recipient);
        }
      });
    }

    logger.info(`Parsed ${recipients.length} recipients from Excel file`);
    return recipients;
  } catch (error) {
    logger.error("Error parsing Excel file for recipients:", error);
    throw error;
  }
}

module.exports = {
  parseExcelForEmails,
  parseExcelForRecipients,
};
