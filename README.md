# Email Sender Application

A full-stack email sending application with real-time progress tracking using Socket.io.

## Features

- **Backend (Node.js/Express)**

  - SMTP email sending with Nodemailer
  - Support for comma-separated email lists
  - Excel file upload and parsing with template variables
  - Real-time progress updates via Socket.io
  - Winston logger for logging
  - Helmet for security
  - CORS enabled
  - Template variable replacement ({name}, {email}, etc.)

- **Frontend (React)**
  - Formik and Yup for form validation
  - WYSIWYG editor (React Quill) for email content
  - HTML code editor option
  - **Email Templates** - Pre-built templates with preview
  - **Template Management** - Save and load custom templates
  - Real-time progress tracking
  - Excel file upload support
  - Socket.io client integration
  - Sender name and logo configuration

## Email Templates

The application includes several pre-built email templates:

- **Default Email Template** - Simple, professional design
- **Newsletter Template** - For newsletters with gradient header
- **Promotional Email Template** - For marketing campaigns
- **Simple Text Template** - Minimal, clean design

You can also save your own custom templates for reuse.

## Excel Template

Create an Excel file with columns for recipients. See `email_template_instructions.txt` for details.

Required column:

- `email` - Recipient email address

Optional columns (used as template variables):

- `name`, `company`, `phone`, etc.

All columns can be used in emails as template variables: `{name}`, `{email}`, `{company}`, etc.
