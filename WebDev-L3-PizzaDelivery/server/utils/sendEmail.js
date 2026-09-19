const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =========================
// VERIFICATION EMAIL
// =========================
const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"PizzaHub 🍕" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your PizzaHub Account 🍕",

    html: `
      <div style="
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 40px 30px;
        border: 1px solid #f0f0f0;
        border-radius: 16px;
        background: #ffffff;
      ">

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            font-size: 28px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0;
          ">
            Pizza<span style="color: #dc2626;">Hub</span> 🍕
          </h1>
          <p style="color: #9ca3af; font-size: 11px; letter-spacing: 2px; margin-top: 4px;">
            FRESH • FAST • DELICIOUS
          </p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 22px; margin-bottom: 8px;">
          Welcome, ${name}! 👋
        </h2>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
          Thank you for joining PizzaHub! Please verify your email
          address to activate your account and start ordering
          delicious pizza.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 14px 32px;
              background: #dc2626;
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 800;
              font-size: 15px;
            "
          >
            Verify My Email
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px;">
          This verification link will expire in <strong>15 minutes</strong>.
        </p>

        <p style="color: #9ca3af; font-size: 13px;">
          If you didn't create a PizzaHub account, you can safely ignore
          this email.
        </p>

        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0 15px;" />

        <p style="color: #d1d5db; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} PizzaHub • Made with ❤️ for pizza lovers
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// =========================
// PASSWORD RESET EMAIL
// =========================
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl =
    `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"PizzaHub 🍕" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your PizzaHub Password 🔐",

    html: `
      <div style="
        font-family: 'Segoe UI', Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 40px 30px;
        border: 1px solid #f0f0f0;
        border-radius: 16px;
        background: #ffffff;
      ">

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            font-size: 28px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0;
          ">
            Pizza<span style="color: #dc2626;">Hub</span> 🍕
          </h1>
          <p style="color: #9ca3af; font-size: 11px; letter-spacing: 2px; margin-top: 4px;">
            FRESH • FAST • DELICIOUS
          </p>
        </div>

        <h2 style="color: #1a1a1a; font-size: 22px; margin-bottom: 8px;">
          Password Reset Request
        </h2>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
          Hi ${name}, we received a request to reset your PizzaHub
          account password. Click the button below to create a new
          password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 14px 32px;
              background: #dc2626;
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 800;
              font-size: 15px;
            "
          >
            Reset My Password
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 13px;">
          This reset link will expire in <strong>15 minutes</strong>.
        </p>

        <p style="color: #9ca3af; font-size: 13px;">
          If you didn't request a password reset, you can safely ignore
          this email. Your password will remain unchanged.
        </p>

        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0 15px;" />

        <p style="color: #d1d5db; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} PizzaHub • Made with ❤️ for pizza lovers
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};