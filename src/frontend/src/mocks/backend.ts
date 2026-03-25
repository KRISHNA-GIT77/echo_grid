import type {
  IncidentReport,
  IncidentType,
  Profile,
  Severity,
  UserRole,
  backendInterface,
} from "../backend";
import { Principal } from "@icp-sdk/core/principal";

function anonymousPrincipal(): Principal {
  // `2vxsx-fae` is the well-known anonymous principal text form.
  const anyPrincipal = Principal as unknown as {
    anonymous?: () => Principal;
    fromText?: (t: string) => Principal;
  };
  if (anyPrincipal.anonymous) return anyPrincipal.anonymous();
  if (anyPrincipal.fromText) return anyPrincipal.fromText("2vxsx-fae");
  // Should never happen, but keeps the mock resilient across SDK versions.
  return "2vxsx-fae" as unknown as Principal;
}

class InMemoryMockBackend implements backendInterface {
  private reports: IncidentReport[] = [];
  private profile: Profile | null = null;
  private role: UserRole = "guest" as unknown as UserRole;

  async _initializeAccessControlWithSecret(_userSecret: string): Promise<void> {}

  async assignCallerUserRole(_user: Principal, role: UserRole): Promise<void> {
    this.role = role;
  }

  async getCallerUserRole(): Promise<UserRole> {
    return this.role;
  }

  async isCallerAdmin(): Promise<boolean> {
    return (this.role as unknown as string) === "admin";
  }

  async saveCallerUserProfile(profile: Profile): Promise<void> {
    this.profile = profile;
    // If someone sets up a profile in demo mode, treat them like a regular user.
    if ((this.role as unknown as string) === "guest") {
      this.role = "user" as unknown as UserRole;
    }
  }

  async getCallerUserProfile(): Promise<Profile | null> {
    return this.profile;
  }

  async getUserProfile(_user: Principal): Promise<Profile | null> {
    return this.profile;
  }

  async createReport(
    incidentType: IncidentType,
    severity: Severity,
    description: string,
    latitude: number,
    longitude: number,
  ): Promise<bigint> {
    const id = BigInt(Date.now());
    const report: IncidentReport = {
      id,
      userName: this.profile?.name ?? "Demo User",
      userId: anonymousPrincipal(),
      description,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000), // ms -> ns-ish
      severity,
      location: { latitude, longitude },
      incidentType,
    };
    this.reports = [report, ...this.reports];
    return id;
  }

  async deleteReport(reportId: bigint): Promise<void> {
    this.reports = this.reports.filter((r) => r.id !== reportId);
  }

  async getAllReports(): Promise<Array<IncidentReport>> {
    return this.reports;
  }

  async getReport(reportId: bigint): Promise<IncidentReport> {
    const found = this.reports.find((r) => r.id === reportId);
    if (!found) throw new Error("Report not found");
    return found;
  }

  async getReportsByType(incidentType: IncidentType): Promise<Array<IncidentReport>> {
    return this.reports.filter((r) => r.incidentType === incidentType);
  }

  async getReportsNearLocation(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Array<IncidentReport>> {
    // Very rough distance filter (demo only).
    const r = Math.max(radius, 0);
    return this.reports.filter((rep) => {
      const dLat = rep.location.latitude - latitude;
      const dLng = rep.location.longitude - longitude;
      return Math.sqrt(dLat * dLat + dLng * dLng) <= r;
    });
  }
}

export const mockBackend: backendInterface = new InMemoryMockBackend();

