const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Create a nodemailer transporter with SMTP configuration
 * @param {Object} config - SMTP configuration
 * @param {string} config.host - SMTP host
 * @param {number} config.port - SMTP port
 * @param {boolean} config.secure - Use SSL/TLS
 * @param {string} config.user - SMTP username/email
 * @param {string} config.password - SMTP password
 * @returns {Object} Nodemailer transporter
 */
function createTransporter(config) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || Number(config.port) === 465,
      auth: {
        user: config.user,
        pass: config.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    return transporter;
  } catch (error) {
    logger.error('Error creating transporter:', error);
    throw error;
  }
}

/**
 * Replace template variables in text
 * @param {string} text - Text with template variables like {name}, {email}
 * @param {Object} variables - Object with variable values
 * @returns {string} Text with variables replaced
 */
function replaceTemplateVariables(text, variables = {}) {
  if (!text || typeof text !== 'string') return text;
  
  let result = text;
  Object.keys(variables).forEach((key) => {
    const value = variables[key] || '';
    const regex = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(regex, value);
  });
  
  return result;
}

/**
 * Send email using nodemailer
 * @param {Object} transporter - Nodemailer transporter
 * @param {Object} emailData - Email data
 * @param {string} emailData.from - Sender email
 * @param {string} emailData.fromName - Sender name (optional)
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - Email HTML content
 * @param {string} emailData.text - Email text content (optional)
 * @param {Object} templateVariables - Template variables to replace (optional)
 * @returns {Promise} Send result
 */
async function sendEmail(transporter, emailData, templateVariables = {}) {
  try {
    // Format from address with name if provided
    let fromAddress = emailData.from;
    if (emailData.fromName) {
      fromAddress = `"${emailData.fromName}" <${emailData.from}>`;
    }

    // Replace template variables
    const subject = replaceTemplateVariables(emailData.subject, templateVariables);
    const html = replaceTemplateVariables(emailData.html, templateVariables);
    const text = replaceTemplateVariables(
      emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
      templateVariables
    );

    const mailOptions = {
      from: fromAddress,
      to: emailData.to,
      subject: subject,
      html: html,
      text: text
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${emailData.to}`);
    return { success: true, messageId: result.messageId, to: emailData.to };
  } catch (error) {
    logger.error(`Error sending email to ${emailData.to}:`, error);
    return { success: false, error: error.message, to: emailData.to };
  }
}

/**
 * Verify SMTP connection
 * @param {Object} transporter - Nodemailer transporter
 * @returns {Promise<boolean>} Verification result
 */
async function verifyConnection(transporter) {
  try {
    await transporter.verify();
    logger.info('SMTP connection verified');
    return true;
  } catch (error) {
    logger.error('SMTP verification failed:', error);
    return false;
  }
}

module.exports = {
  createTransporter,
  sendEmail,
  verifyConnection,
  replaceTemplateVariables
};

