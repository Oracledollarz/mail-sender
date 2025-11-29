const mailer = require("../lib/mailer");
const excelParser = require("../lib/excelParser");
const logger = require("../lib/logger");

/**
 * Parse email list from various formats
 * @param {string|Array} emailInput - Comma-separated string, array, or single email
 * @returns {Array<string>} Array of email addresses
 */
function parseEmailList(emailInput) {
  if (!emailInput) return [];

  if (Array.isArray(emailInput)) {
    return emailInput.map((email) => email.trim()).filter((email) => email);
  }

  if (typeof emailInput === "string") {
    return emailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email && email.includes("@"));
  }

  return [];
}

/**
 * Send emails to a list of recipients
 */
async function sendEmails(req, res) {
  const io = req.app.get("io");
  const { smtpConfig, emailData, recipients, recipientsData } = req.body;

  try {
    // Validate required fields
    if (!smtpConfig || !emailData || !recipients) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: smtpConfig, emailData, and recipients are required",
      });
    }

    // Validate SMTP config
    if (
      !smtpConfig.host ||
      !smtpConfig.port ||
      !smtpConfig.user ||
      !smtpConfig.password
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid SMTP configuration",
      });
    }

    // Validate email data
    if (!emailData.from || !emailData.subject || !emailData.html) {
      return res.status(400).json({
        success: false,
        message: "Invalid email data: from, subject, and html are required",
      });
    }

    // Create transporter
    const transporter = mailer.createTransporter(smtpConfig);

    // Verify connection
    const isVerified = await mailer.verifyConnection(transporter);
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "SMTP connection verification failed",
      });
    }

    // Parse recipients
    let emailList = [];
    let recipientsWithData = [];

    // If recipientsData is provided (from Excel), use it
    if (
      recipientsData &&
      Array.isArray(recipientsData) &&
      recipientsData.length > 0
    ) {
      recipientsWithData = recipientsData;
      emailList = recipientsData.map((r) => r.email || r);
    } else if (typeof recipients === "string") {
      emailList = parseEmailList(recipients);
      recipientsWithData = emailList.map((email) => ({ email, data: {} }));
    } else if (Array.isArray(recipients)) {
      emailList = recipients;
      recipientsWithData = emailList.map((email) => ({ email, data: {} }));
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid recipients format",
      });
    }

    if (emailList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid email addresses found",
      });
    }

    // Send emails with progress updates
    const results = {
      total: emailList.length,
      successful: 0,
      failed: 0,
      details: [],
    };

    // Emit start event
    if (io) {
      io.emit("email-send-start", {
        total: emailList.length,
        message: "Starting to send emails...",
      });
    }

    // Send emails one by one
    for (let i = 0; i < emailList.length; i++) {
      const recipient = emailList[i];
      const recipientData = recipientsWithData[i] || {
        email: recipient,
        data: {},
      };
      const templateVars = {
        email: recipientData.email || recipient,
        ...recipientData.data,
      };

      try {
        const result = await mailer.sendEmail(
          transporter,
          {
            ...emailData,
            to: recipientData.email || recipient,
          },
          templateVars
        );

        if (result.success) {
          results.successful++;
          results.details.push({
            email: recipient,
            status: "success",
            messageId: result.messageId,
          });
        } else {
          results.failed++;
          results.details.push({
            email: recipient,
            status: "failed",
            error: result.error,
          });
        }

        // Emit progress update
        if (io) {
          io.emit("email-send-progress", {
            current: i + 1,
            total: emailList.length,
            email: recipient,
            status: result.success ? "success" : "failed",
            successful: results.successful,
            failed: results.failed,
          });
        }

        // Small delay to avoid overwhelming SMTP server
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.failed++;
        results.details.push({
          email: recipient,
          status: "failed",
          error: error.message,
        });

        if (io) {
          io.emit("email-send-progress", {
            current: i + 1,
            total: emailList.length,
            email: recipient,
            status: "failed",
            error: error.message,
            successful: results.successful,
            failed: results.failed,
          });
        }
      }
    }

    // Emit completion event
    if (io) {
      io.emit("email-send-complete", {
        total: results.total,
        successful: results.successful,
        failed: results.failed,
        details: results.details,
      });
    }

    logger.info(
      `Email sending completed: ${results.successful} successful, ${results.failed} failed`
    );

    res.json({
      success: true,
      message: "Email sending process completed",
      results,
    });
  } catch (error) {
    logger.error("Error in sendEmails controller:", error);

    if (io) {
      io.emit("email-send-error", {
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

/**
 * Upload Excel file and extract emails
 */
async function uploadExcelFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { sheetName, columnName, fullData } = req.body;

    // If fullData is requested, return recipients with all their data
    if (fullData === "true" || fullData === true) {
      const recipients = excelParser.parseExcelForRecipients(
        req.file.buffer,
        sheetName || null
      );

      // Extract available template variables from first recipient
      const availableVars =
        recipients.length > 0 ? Object.keys(recipients[0].data || {}) : [];

      res.json({
        success: true,
        recipients,
        emails: recipients.map((r) => r.email),
        count: recipients.length,
        availableVariables: availableVars,
      });
    } else {
      // Legacy: just return emails
      const emails = excelParser.parseExcelForEmails(
        req.file.buffer,
        sheetName || null,
        columnName || "email"
      );

      res.json({
        success: true,
        emails,
        count: emails.length,
      });
    }
  } catch (error) {
    logger.error("Error uploading Excel file:", error);
    res.status(500).json({
      success: false,
      message: "Error parsing Excel file",
      error: error.message,
    });
  }
}

/**
 * Test SMTP connection
 */
async function testSMTPConnection(req, res) {
  try {
    const { smtpConfig } = req.body;

    if (
      !smtpConfig ||
      !smtpConfig.host ||
      !smtpConfig.port ||
      !smtpConfig.user ||
      !smtpConfig.password
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid SMTP configuration",
      });
    }

    const transporter = mailer.createTransporter(smtpConfig);
    const isVerified = await mailer.verifyConnection(transporter);

    if (isVerified) {
      res.json({
        success: true,
        message: "SMTP connection successful",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "SMTP connection failed",
      });
    }
  } catch (error) {
    logger.error("Error testing SMTP connection:", error);
    res.status(500).json({
      success: false,
      message: "Error testing SMTP connection",
      error: error.message,
    });
  }
}

module.exports = {
  sendEmails,
  uploadExcelFile,
  testSMTPConnection,
};
