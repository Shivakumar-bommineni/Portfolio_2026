require('dotenv').config();

const sendOTPSMS = async (phone, otp) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.NODE_ENV === 'development') {
    console.log(`\n📱 [DEV MODE] OTP for ${phone}: ${otp}\n`);
    return { success: true, sid: 'dev_console' };
  }

  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const message = await client.messages.create({
    body: `Your ShivaKumar_B verification code is ${otp}. Valid for 5 minutes. Never share this code.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return { success: true, sid: message.sid };
};

module.exports = { sendOTPSMS };
