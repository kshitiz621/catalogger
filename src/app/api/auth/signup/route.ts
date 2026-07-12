import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { SellerSignupSchema, SellerOAuthSignupSchema } from "@/lib/schema";
import { registerSellerStore } from "@/lib/services/signup.service";
import { PlatformGuardService } from "@/lib/security/platform-guard";
import { jsonError } from "@/lib/api/handler";
import { logger } from "@/lib/monitoring/logger";

export async function POST(req: Request) {
  try {
    const [registrationEnabled, maintenanceActive] = await Promise.all([
      PlatformGuardService.isRegistrationEnabled(),
      PlatformGuardService.isMaintenanceActive(),
    ]);

    if (maintenanceActive) {
      return jsonError("Registration is temporarily unavailable", 503);
    }

    if (!registrationEnabled) {
      return jsonError("New seller registration is currently closed", 403);
    }

    const { data: session } = await auth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Sign in first to create your store" }, { status: 401 });
    }

    const body = await req.json();
    const sessionEmail = session.user.email.toLowerCase();

    let registrationInput;

    if (body.password) {
      const result = SellerSignupSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { message: result.error.issues[0].message },
          { status: 400 }
        );
      }

      if (result.data.email !== sessionEmail) {
        return NextResponse.json(
          { message: "Email does not match authenticated session" },
          { status: 400 }
        );
      }

      registrationInput = {
        name: result.data.name,
        email: result.data.email,
        businessName: result.data.businessName,
        whatsappNumber: result.data.whatsappNumber,
        storeSlug: result.data.storeSlug,
      };
    } else {
      const result = SellerOAuthSignupSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { message: result.error.issues[0].message },
          { status: 400 }
        );
      }

      registrationInput = {
        name:
          result.data.name ||
          session.user.name ||
          sessionEmail.split("@")[0],
        email: sessionEmail,
        businessName: result.data.businessName,
        whatsappNumber: result.data.whatsappNumber,
        storeSlug: result.data.storeSlug,
      };
    }

    const registration = await registerSellerStore(registrationInput);

    if ("error" in registration) {
      return NextResponse.json({ message: registration.error }, { status: 409 });
    }

    return NextResponse.json(
      {
        message: "Store created successfully",
        user: registration.user,
        store: registration.store,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Signup error", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return jsonError("Something went wrong", 500);
  }
}
