//
"use server";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
//
export async function sendCertificatesEmail(mailData: any) {
  console.log("send email");
  return new Promise(async (resolve, reject) => {
    const {
      MAILING_SERVICE_CLIENT_ID,
      MAILING_SERVICE_CLIENT_SECRET,
      MAILING_SERVICE_REFRESH_TOKEN,
      SENDER_EMAIL_ADDRESS,
      SMTP_SERVER_ADDRESS,
    } = process.env;
    const oauth2Client = new google.auth.OAuth2(
      MAILING_SERVICE_CLIENT_ID,
      MAILING_SERVICE_CLIENT_SECRET,
      OAUTH_PLAYGROUND
    );

    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER_ADDRESS,
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    } as SMTPTransport.Options);

    transporter.sendMail(mailData, async function (error, info) {
      if (error) {
        console.log(error);
        return reject(error);
      } else {
        console.log("Email sent: " + info.response);
        return resolve(info.response);
      }
    });
  });
}
