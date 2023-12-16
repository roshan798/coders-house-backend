import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import twilio from 'twilio';
import HashService from './hashService.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class OtpService {
    async generateOtp() {
        return new Promise((resolve, reject) => {
            try {
                const otp = crypto.randomInt(1000, 9999);
                resolve(otp);
            } catch (error) {
                reject(error);
            }
        })
    }
    async sendBySMS(phoneNumber, otp) {
        return await client.messages.create(
            {
                from: process.env.SMS_FROM_NUMBER,
                to: phoneNumber,
                body: `Your Coders house OTP is ${otp}`
            });


    }

    verifyOtp(data, hash) {
        const computedHash = HashService.hashOtp(data);
        const res = (computedHash === hash);
        // console.log("inside otpService  matching=> ",res);
        return res;
    }
}
export default new OtpService();