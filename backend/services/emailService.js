const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


const generateOTP = () => {
  // Generate 4-digit OTP (1000-9999)
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Send OTP email using Resend
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.APP_NAME || 'Carzilla'} <onboarding@resend.dev>`,
      to: [email],
      subject: `Your ${process.env.APP_NAME || 'Carzilla'} Sign-In Code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚗 ${process.env.APP_NAME || 'Carzilla'}</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Dream. Deal. Drive.</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Your Sign-In Code</h2>
            <p style="font-size: 16px; color: #666;">Use this code to complete your sign-in:</p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
              ⏱️ This code will expire in <strong>5 minutes</strong>
            </p>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                🔒 <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP.
              </p>
            </div>
            
            <p style="font-size: 13px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you didn't request this code, please ignore this email or contact our support team.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Carzilla'}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};
