import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Contact Route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: "All fields required" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Message: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    });

    return res.json({ success: true, message: "Message sent successfully!" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
