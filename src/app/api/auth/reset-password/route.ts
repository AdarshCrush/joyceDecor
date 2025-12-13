import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

// ✅ POST /api/auth/reset-password
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body as { token?: string; password?: string };

    // 1️⃣ Validate inputs
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 2️⃣ Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // token still valid
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update user password & clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // 5️⃣ Return success
    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully. You can now log in with your new password.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
