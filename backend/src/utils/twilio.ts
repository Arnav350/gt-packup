import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

if (!accountSid || !authToken || !serviceSid) {
  throw new Error("Twilio credentials are not properly configured");
}

const client = twilio(accountSid, authToken);

export const sendVerificationCode = async (phone: string) => {
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+1${phone}`, channel: "sms" });

    return verification;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw new Error("Failed to send verification code");
  }
};

export const verifyCode = async (phone: string, code: string) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+1${phone}`, code });

    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("Error verifying code:", error);
    throw new Error("Failed to verify code");
  }
};
