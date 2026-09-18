const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Pizza Delivery" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Pizza Delivery Account 🍕",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2>Welcome to Pizza Delivery, ${name}! 🍕</h2>

        <p>
          Thank you for creating an account.
          Please verify your email address to activate your account.
        </p>

        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #e63946;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Verify Email
        </a>

        <p style="margin-top: 20px;">
          This verification link will expire in 15 minutes.
        </p>

        <p>
          If you did not create this account, you can ignore this email.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
};