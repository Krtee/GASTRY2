export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  token: string | null;
  password?: string | null;
  activeMatch?: string;
  buddies: Buddy[];
}

export interface Buddy {
  createDate: Date;
  lastUpdated: Date;
  notificationEnabled: boolean;
  buddyId: string;
  buddyType: BuddyType;
}

export enum BuddyType {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  INCOMING = "INCOMING",
}
