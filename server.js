const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error.message);
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log('📧 Sending from:', process.env.EMAIL_USER);
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log('\n📨 New contact form submission:');
    console.log('  Name:', name);
    console.log('  Email:', email);
    console.log('  Subject:', subject);

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Send email to admin FROM user's email with reply-to
    console.log('⏳ Sending email to admin...');
    const adminEmail = await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.RECEIVER_EMAIL,
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
    console.log('✅ Admin email sent! Message ID:', adminEmail.messageId);
    console.log('   From: "' + name + '" <' + process.env.EMAIL_USER + '>');
    console.log('   Reply-To:', email);

    // Send confirmation email to user
    console.log('⏳ Sending confirmation email to user...');
    const userEmail = await transporter.sendMail({
      from: `"Syed Mohathaseem" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Message Received - Thank You!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>I received your message and will get back to you as soon as possible.</p>
        <hr>
        <p><strong>📝 Your message:</strong></p>
        <p style="white-space: pre-wrap; font-size: 14px; background: #f5f5f5; padding: 15px; border-left: 4px solid #2196F3;">${message}</p>
        <hr>
        <p>Best regards,<br><strong>Syed Mohathaseem</strong></p>
        <p style="font-size: 12px; color: #666;">This is an automated reply. I will contact you shortly.</p>
      `
    });
    console.log('✅ User confirmation email sent! Message ID:', userEmail.messageId);
    console.log('   To:', email);

    res.status(200).json({ 
      success: true, 
      message: '✅ Email sent successfully! Check your inbox.' 
    });

  } catch (error) {
    console.error('\n❌ Email error:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER}`);
  console.log(`📬 Receiving emails to: ${process.env.RECEIVER_EMAIL}\n`);
});