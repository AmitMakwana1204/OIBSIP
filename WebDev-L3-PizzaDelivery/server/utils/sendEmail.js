const nodemailer = require("nodemailer");

const PRODUCTION_CLIENT_URL =
  "https://oibsip-seven-rho.vercel.app";

const getClientUrl = () => {
  const envUrl = process.env.CLIENT_URL?.trim().replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") {
    return envUrl || "http://localhost:5173";
  }

  // In production or other environments, ensure we never use localhost
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }

  return PRODUCTION_CLIENT_URL;
};

let cachedTransporter = null;

const getTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    console.error(
      "Verification email error: EMAIL_USER or EMAIL_PASS is missing from environment variables."
    );
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return cachedTransporter;
};

// =========================
// SIMPLE WELCOME EMAIL (OPTIONAL & NON-BLOCKING)
// =========================
const sendWelcomeEmail = async (email, name) => {
  const transporter = getTransporter();

  if (!transporter) {
    const missingError = new Error(
      "EMAIL_USER or EMAIL_PASS is not configured in server environment variables."
    );
    console.error("Welcome email error:", missingError);
    throw missingError;
  }

  const mailOptions = {
    from: `"PizzaHub 🍕" <${process.env.EMAIL_USER.trim()}>`,
    to: email,
    subject: "Welcome to PizzaHub! 🍕",

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
        <div style="text-align: center; margin-bottom: 24px;">
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
          Welcome, ${name || "Pizza Lover"}! 👋
        </h2>

        <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
          Welcome to PizzaHub! Your account has been created successfully. You can now log in, explore our fresh menu, and order your favorite delicious pizzas.
        </p>

        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0 15px;" />

        <p style="color: #9ca3af; font-size: 11px; text-align: center;">
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
  const transporter = getTransporter();

  if (!transporter) {
    const missingError = new Error(
      "EMAIL_USER or EMAIL_PASS is not configured in server environment variables."
    );
    console.error("Password reset email error:", missingError);
    throw missingError;
  }

  const resetUrl =
    `${getClientUrl()}/reset-password/${encodeURIComponent(token)}`;

  const mailOptions = {
    from: `"PizzaHub 🍕" <${process.env.EMAIL_USER.trim()}>`,
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
  sendWelcomeEmail,
  sendVerificationEmail: sendWelcomeEmail,
  sendPasswordResetEmail,
};