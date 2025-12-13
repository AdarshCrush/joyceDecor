import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import * as nodemailer from "nodemailer";

interface ForgotPasswordRequest {
  email: string;
}

// 📧 Function to send reset password email
async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use Gmail App Password (not normal password)
    },
  });

  const mailOptions = {
    from: `"JoycDecor" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - JoycDecor",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JoycDecor</h1>
            <p>Premium Event Decorations</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your JoycDecor account. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">Reset Your Password</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px; font-size: 14px;">
              ${resetLink}
            </p>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
            
            <div class="footer">
              <p>Thank you,<br>The JoycDecor Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Password reset email sent to ${email}`);
}

// 📮 POST /api/auth/forgot-password
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ForgotPasswordRequest;
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // ✅ Check if user exists
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Return success even if user doesn't exist (to prevent email enumeration)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // ✅ Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // ✅ Save token in DB
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { resetToken, resetTokenExpiry },
    });

    // ✅ Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      success: true,
      message: "Password reset link sent successfully. Check your inbox.",
    });
  } catch (error: any) {
    console.error("❌ Forgot password error:", error);

    if (error.message?.includes("sendMail")) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
