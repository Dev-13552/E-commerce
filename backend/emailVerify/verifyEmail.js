import nodemailer from "nodemailer";
import "dotenv/config";

// export const verifyEmail = async (token, email) => {
//   let testAccount = await nodemailer.createTestAccount();
//   let mailTransporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   let mailDetails = {
//     from: '"Verify Service" <no-reply@example.com>',
//     to: email,
//     subject: "Email Verification",
//     text: `Hi! There, You have recently visited our website and entered your email.
//             Please follow the given link to verify your email
//             http://localhost:5173/verify/${token}
//             Thanks`,
//   };

//   // mailTransporter.sendMail(mailDetails, function (err, data) {
//   //   if (err) {
//   //     console.log("Error Occurs");
//   //     throw Error(err)
//   //   } else {
//   //     console.log("Email sent successfully");
//   //     console.log(data)
//   //   }
//   // });.
//   try {
//     // 3. Use await instead of a callback
//     let info = await mailTransporter.sendMail(mailDetails);

//     console.log("Email sent successfully!");
//     // 4. IMPORTANT: Click this link in your console to see the email!
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//     return info;
//   } catch (err) {
//     console.error("Error Occurs:", err);
//     throw err;
//   }
// };

export const verifyEmail = async (token, email) => {
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
    subject: "Email Verification",
    text: `Hi! There, You have recently visited our website and entered your email.
            Please follow the given link to verify your email
            http://localhost:5173/verify/${token}
            Thanks`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
