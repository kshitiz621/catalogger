import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { Prisma } from "@prisma/client";

export type AppSessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  status: string;
};

export type AppSession = {
  user: AppSessionUser;
};

type UserRecord = {
  id: string;
  email: string;
  name: string | null;
  role?: string;
  status?: string;
};

function isMissingColumnError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2022"
  );
}

async function findUserByEmail(email: string): Promise<UserRecord | null> {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });
  } catch (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    role: "SELLER",
    status: "ACTIVE",
  };
}

export async function getAppSession(): Promise<AppSession | null> {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    return null;
  }

  try {
    const user = await findUserByEmail(session.user.email);

    if (!user || user.status === "SUSPENDED") {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role ?? "SELLER",
        status: user.status ?? "ACTIVE",
      },
    };
  } catch (error) {
    console.error("getAppSession failed:", error);
    return null;
  }
}