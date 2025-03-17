import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import nodemailer from 'nodemailer';

const gmail = google.gmail('v1');

// Function to generate a random 6-digit OTP (Keeping original for consistency)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Initialize Gmail API client
async function initializeGmailClient() {
  try {
    const auth = await authenticate({
      keyfilePath: path.join(process.cwd(), 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    });

    google.options({ auth });
    return auth;
  } catch (error) {
    console.error('Error initializing Gmail client:', error);
    throw error;
  }
}

// Function to create email message
function createMessage(to: string, otp: string) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to Restaurant App!</h2>
      <p>Please use the following code to verify your email address:</p>
      <h1 style="color: #0ea5e9; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    </div>
  `;

  const str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ', to, '\n',
    'from: "Restaurant App" <noreply@restaurant.com>\n',
    'subject: Email Verification\n\n',
    emailContent
  ].join('');

  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

// Function to send verification email
export async function sendVerificationEmail(email: string, otp: string): Promise<boolean> {
  try {
    const auth = await initializeGmailClient();

    const raw = createMessage(email, otp);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw
      }
    });

    console.log('Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}