// 예약 발생메일

"use server";

import nodemailer from "nodemailer";

//

export default async function sendMail(mailData: any) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // 아래 secure 옵션을 사용하려면 465 포트를 사용해야함
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      // 초기에 설정해둔 env 데이터
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      }

      console.log("Email sent: ", info);
      resolve("success");
    });
  });
}
