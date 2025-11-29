export const defaultTemplates = [
  {
    id: "default",
    name: "Default Email Template",
    subject: "Hello {name}",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
    <h1 style="color: #333; margin: 0;">Hello {name}!</h1>
  </div>
  <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
    <p>Dear {name},</p>
    <p>This is a personalized email sent to {email}.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>Email Sender Team</p>
  </div>
</body>
</html>`
  },
  {
    id: "newsletter",
    name: "Newsletter Template",
    subject: "Newsletter - {name}",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Newsletter</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
    <h2 style="color: #667eea;">Hello {name}!</h2>
    <p>Welcome to our newsletter. We're excited to share the latest updates with you.</p>
    <p>Your email: {email}</p>
    <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #667eea;">
      <p style="margin: 0;"><strong>Important Update:</strong> Stay tuned for more exciting news!</p>
    </div>
    <p>Thank you for being part of our community!</p>
    <p>Best regards,<br><strong>Newsletter Team</strong></p>
  </div>
</body>
</html>`
  },
  {
    id: "promotional",
    name: "Promotional Email Template",
    subject: "Special Offer for {name}!",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promotional Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0; font-size: 32px;">🎉 Special Offer! 🎉</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
    <h2 style="color: #ff6b6b;">Hello {name}!</h2>
    <p>We have an exclusive offer just for you!</p>
    <div style="text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; border-radius: 10px;">
      <h3 style="margin: 0 0 10px 0; font-size: 36px;">50% OFF</h3>
      <p style="margin: 0; font-size: 18px;">Limited Time Offer</p>
    </div>
    <p>Don't miss out on this amazing opportunity, {name}!</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="#" style="background-color: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Claim Your Offer</a>
    </p>
    <p>Best regards,<br><strong>Promotions Team</strong></p>
  </div>
</body>
</html>`
  },
  {
    id: "simple",
    name: "Simple Text Template",
    subject: "Message for {name}",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <p>Dear {name},</p>
  <p>I hope this message finds you well.</p>
  <p>This is a simple, clean email template.</p>
  <p>Best regards,<br>Sender</p>
</body>
</html>`
  }
];

export const getTemplateById = (id) => {
  return defaultTemplates.find(t => t.id === id);
};

export const saveTemplateToLocalStorage = (template) => {
  try {
    const saved = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    const existingIndex = saved.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      saved[existingIndex] = template;
    } else {
      saved.push(template);
    }
    localStorage.setItem('emailTemplates', JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error('Error saving template:', error);
    return false;
  }
};

export const getTemplatesFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('emailTemplates') || '[]');
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
};

export const getAllTemplates = () => {
  const saved = getTemplatesFromLocalStorage();
  return [...defaultTemplates, ...saved];
};


