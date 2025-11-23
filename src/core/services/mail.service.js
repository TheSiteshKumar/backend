import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendForgotPasswordEmail = async (email, otp, token) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: [email],
            subject: 'Reset Your Password',
            html: `
                <h1>Reset Your Password</h1>
                <p>You requested a password reset. Use the following OTP or Token to reset your password:</p>
                <p><strong>OTP:</strong> ${otp}</p>
                <p><strong>Token:</strong> ${token}</p>
                <p>This OTP and Token will expire in ${process.env.RESET_PASSWORD_EXPIRY_MINUTES || 60} minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });

        if (error) {
            console.error("Error sending email:", error);
            return { success: false, error: error };
        }

        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Exception sending email:", error);
        return { success: false, error: { message: error.message } };
    }
};
