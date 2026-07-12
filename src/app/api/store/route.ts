import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth/app-session";
import { StoreSettingsService } from "@/lib/services/store-settings.service";
import { StoreUpdateSchema } from "@/lib/schema";

export async function GET() {
  try {
    const session = await getAppSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const store = await StoreSettingsService.getByUserId(session.user.id);

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Store settings fetch error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "SELLER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const result = StoreUpdateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const store = await StoreSettingsService.update(session.user.id, result.data);

    return NextResponse.json(
      { message: "Store updated successfully", store },
      { status: 200 }
    );
  } catch (error) {
    console.error("Store update error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    const status = message.includes("taken") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
