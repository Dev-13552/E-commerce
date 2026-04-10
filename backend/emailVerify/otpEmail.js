import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailDetails = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Link for changing the password",
    html: `
            <h2>Click this link to change the password: http://localhost:5173/change-password/${email}</h2>
            `,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
      throw Error(err);
    } else {
      console.log("OTP sent successfully");
      console.log(data);
    }
  });
};
