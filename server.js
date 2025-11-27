const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for Netlify
app.use(cors({
  origin: "https://smprofolio.netlify.app",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email sent TO YOU (admin)
    const adminMail = {
      from: process.env.EMAIL_USER,                 // sender = you
      to: process.env.EMAIL_USER,                   // you receive it
      replyTo: email,                               // replies go to user
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Message From Portfolio</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    };

    await transporter.sendMail(adminMail);

    // (Optional) Disable confirmation email to user
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Message Received ✔",
    //   html: `<p>Thank you ${name}, I will reply soon.</p>`
    // });

    res.json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending message",
    });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("🚀 Backend running...")
);
