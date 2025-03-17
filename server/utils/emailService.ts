import nodemailer from 'nodemailer';

// Create a test account using Ethereal for development
let transporter: nodemailer.Transporter;

// Initialize transporter
async function initializeTransporter() {
  // Create a test account for development
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Initialize the transporter when the server starts
initializeTransporter().catch(console.error);

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    // Make sure transporter is initialized
    if (!transporter) {
      await initializeTransporter();
    }

    const info = await transporter.sendMail({
      from: '"Restaurant App" <noreply@restaurant.com>',
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Restaurant App!</h2>
          <p>Please use the following code to verify your email address:</p>
          <h1 style="color: #0ea5e9; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
