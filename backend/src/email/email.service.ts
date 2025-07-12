import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class EmailService {
     private OAuth2 = google.auth.OAuth2;

  async sendOtpEmail(toEmail: string, otpCode: string, username: string) {
    const oauth2Client = new this.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const templatePath = path.join(__dirname, '..', 'mailtemplates', 'verify-otp.html');

    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    htmlTemplate = htmlTemplate
      .replace('[User]', username)
      .replace('[OTP_CODE]', otpCode);

    const mailOptions = {
      from: `"Skill Swap" <${process.env.SENDER_EMAIL}>`,
      to: toEmail,
      subject: 'Verify your OTP - Skill Swap',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
  }
  async sendForgotPasswordOtp(toEmail: string, otpCode: string, username: string) {
    const oauth2Client = new this.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const templatePath = path.join(__dirname, '..','mailtemplates', 'forgot-password.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    htmlTemplate = htmlTemplate
      .replace('[User]', username)
      .replace('[OTP_CODE]', otpCode);

    const mailOptions = {
      from: `"Skill Swap" <${process.env.SENDER_EMAIL}>`,
      to: toEmail,
      subject: 'Forgot Password - OTP Verification',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
  }

  // Inside email.service.ts
async sendRequestAcceptedMail(toEmail: string, username: string, otherUsername: string, appLink: string) {
  const oauth2Client = new this.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const templatePath = path.join(__dirname, '..', 'mailtemplates', 'request-accepted.html');
  let html = fs.readFileSync(templatePath, 'utf-8');
  html = html
    .replace('[User]', username)
    .replace('[Other User]', otherUsername)
    .replace('[APP_LINK]', appLink);

  await transporter.sendMail({
    from: `"Skill Swap" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: '🎉 Your Skill Swap Request Was Accepted!',
    html,
  });
}

async sendRequestRejectedMail(toEmail: string, username: string, otherUsername: string, appLink: string) {
  const oauth2Client = new this.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground',
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const templatePath = path.join(__dirname, '..', 'mailtemplates', 'request-rejected.html');
  let html = fs.readFileSync(templatePath, 'utf-8');
  html = html
    .replace('[User]', username)
    .replace('[Other User]', otherUsername)
    .replace('[APP_LINK]', appLink);

  await transporter.sendMail({
    from: `"Skill Swap" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Skill Swap Request Update',
    html,
  });
}

}
