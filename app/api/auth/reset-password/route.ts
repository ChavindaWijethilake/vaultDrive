import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

function generateTempPassword(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, customPassword } = body;

        if (!email) {
            return NextResponse.json(
                { ok: false, error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate custom password if provided
        if (customPassword && customPassword.length < 6) {
            return NextResponse.json(
                { ok: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!user) {
            return NextResponse.json(
                { ok: false, error: "No account found with this email address" },
                { status: 404 }
            );
        }

        // Use custom password if provided, otherwise generate one
        const passwordToUse = customPassword || generateTempPassword();

        // Hash the new password
        const hashedPassword = await bcrypt.hash(passwordToUse, 10);

        // Update user's password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            ok: true,
            tempPassword: customPassword ? undefined : passwordToUse,
            customPassword: customPassword ? true : false,
            message: "Password has been reset successfully",
        });
    } catch (e: any) {
        console.error("Password reset error:", e);
        return NextResponse.json(
            { ok: false, error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
