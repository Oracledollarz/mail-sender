# Email Template Instructions

## Excel Template

The `email_template.xlsx` file in the root directory is a sample template for importing recipients.

### Required Columns:

- **email** (required) - Recipient email address
- **name** (optional) - Recipient name

### Optional Columns:

You can add any columns you want to use as template variables:

- company
- phone
- address
- custom_field_1
- etc.

All column names will be normalized to lowercase with underscores (e.g., "First Name" becomes "first_name") and can be used in emails as `{first_name}`.

## HTML Email Templates

Default templates are stored in `templates/email-templates.json`. You can:

1. Select a template from the dropdown
2. Preview the template
3. Customize it using the WYSIWYG editor
4. Use template variables like `{name}`, `{email}`, etc.

### Available Default Templates:

- **Default Email Template** - Simple, professional template
- **Newsletter Template** - For newsletters with gradient header
- **Promotional Email Template** - For marketing campaigns
- **Simple Text Template** - Minimal, clean design

