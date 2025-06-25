// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendVerificationEmail = async (email, token) => {
//   const verificationUrl = `http://localhost:${process.env.PORT}/auth/verify/${token}`;
  
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Verify Your E-Library Account',
//     html: `
//       <h1>Welcome to E-Library!</h1>
//       <p>Please click the link below to verify your email address:</p>
//       <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
//       <p>If you didn't create an account, please ignore this email.</p>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Verification email sent successfully');
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error;
//   }
// };

// module.exports = {
//   sendVerificationEmail
// };

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Accept unauthorized certs (for development)
  }
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:${process.env.PORT}/auth/verify/${token}`;

  const mailOptions = {
    from: `"E-Library 📚" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your E-Library Account',
    html: `
      <h2>Welcome to E-Library!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
      <p>If you did not create this account, you can safely ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail
};
