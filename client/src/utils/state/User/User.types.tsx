export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole | string;
}
