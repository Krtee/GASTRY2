export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  role: UserRole | string;
  password?: string;
  posts: [];
}
