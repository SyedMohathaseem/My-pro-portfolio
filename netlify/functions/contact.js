const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'All fields are required' 
        })
      };
    }

    // Send email to admin
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2 style="color: #333;">📨 New Message from Your Portfolio</h2>
        <p><strong>👤 Name:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>📝 Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>💬 Message:</strong></p>
        <p style="white-space: pre-wrap; font-size: 14px; background: #f5f5f5; padding: 15px; border-left: 4px solid #4CAF50;">${message}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">Reply directly to this email to respond to ${name}</p>
      `
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Syed Mohathaseem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Message Received - Thank You!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>I received your message and will get back to you as soon as possible.</p>
        <hr>
        <p><strong>📝 Your message:</strong></p>
        <p style="white-space: pre-wrap; font-size: 14px; background: #f5f5f5; padding: 15px;">${message}</p>
        <hr>
        <p>Best regards,<br><strong>Syed Mohathaseem</strong></p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully!' 
      })
    };

  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};