// ✅ lib/sendPasswordResetEmail.ts

/**
 * Mock email service for sending password reset links.
 * 
 * Replace this with a real email service (e.g., Nodemailer, SendGrid, Resend)
 * when deploying to production.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  // For development / debugging
  console.log(`📧 Password reset link for ${email}:`);
  console.log(resetLink);

  // TODO: Replace with real email sending logic
  // Example:
  // await transporter.sendMail({
  //   from: "no-reply@yourapp.com",
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  // });

  return Promise.resolve();
}
