import { prisma } from "@/lib/prisma";
import { isMaintenanceMode } from "@/lib/env";

export class PlatformGuardService {
  static async getSettings() {
    return prisma.platformSettings.findUnique({
      where: { id: "singleton" },
    });
  }

  static async isRegistrationEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings?.registrationEnabled ?? true;
  }

  static async isMaintenanceActive(): Promise<boolean> {
    if (isMaintenanceMode()) return true;
    const settings = await this.getSettings();
    return settings?.maintenanceMode ?? false;
  }
}
