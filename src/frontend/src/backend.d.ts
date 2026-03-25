import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude: number;
    longitude: number;
}
export interface IncidentReport {
    id: bigint;
    userName: string;
    userId: Principal;
    description: string;
    timestamp: Time;
    severity: Severity;
    location: Location;
    incidentType: IncidentType;
}
export type Time = bigint;
export interface Profile {
    city: string;
    name: string;
    phoneNumber: string;
}
export enum IncidentType {
    flood = "flood",
    earthquake = "earthquake",
    fire = "fire",
    lightning = "lightning"
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createReport(incidentType: IncidentType, severity: Severity, description: string, latitude: number, longitude: number): Promise<bigint>;
    deleteReport(reportId: bigint): Promise<void>;
    getAllReports(): Promise<Array<IncidentReport>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getReport(reportId: bigint): Promise<IncidentReport>;
    getReportsByType(incidentType: IncidentType): Promise<Array<IncidentReport>>;
    getReportsNearLocation(latitude: number, longitude: number, radius: number): Promise<Array<IncidentReport>>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
}
