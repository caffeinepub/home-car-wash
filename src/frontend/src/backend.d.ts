import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WashStats {
    completedWashes: bigint;
    upcomingWashes: bigint;
    cancelledWashes: bigint;
    totalWashes: bigint;
}
export interface WashAppointment {
    id: bigint;
    status: AppointmentStatus;
    scheduledDate: string;
    owner: Principal;
    scheduledTime: string;
    createdAt: bigint;
    washType: WashType;
    address: string;
    vehicleId: bigint;
}
export interface Vehicle {
    id: bigint;
    model: string;
    licensePlate: string;
    owner: Principal;
    make: string;
}
export interface UserProfile {
    name: string;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WashType {
    premium = "premium",
    basic = "basic",
    standard = "standard"
}
export interface backendInterface {
    addVehicle(make: string, model: string, licensePlate: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookWash(vehicleId: bigint, washType: WashType, scheduledDate: string, scheduledTime: string, address: string): Promise<bigint>;
    cancelAppointment(id: bigint): Promise<void>;
    deleteVehicle(id: bigint): Promise<void>;
    getAllAppointments(): Promise<Array<WashAppointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyAppointments(): Promise<Array<WashAppointment>>;
    getMyPastAppointments(): Promise<Array<WashAppointment>>;
    getMyUpcomingAppointments(): Promise<Array<WashAppointment>>;
    getMyWashStats(): Promise<WashStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listMyVehicles(): Promise<Array<Vehicle>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppointmentStatus(id: bigint, status: AppointmentStatus): Promise<void>;
}
