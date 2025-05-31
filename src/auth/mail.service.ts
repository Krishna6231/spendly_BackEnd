import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); 

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.DOMAIN_EMAIL_PASS,
  },
});
