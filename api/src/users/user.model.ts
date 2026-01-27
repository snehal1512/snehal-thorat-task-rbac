export type UserRole = 'OWNER' | 'ADMIN' | 'VIEWER';

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  organizationId: number;
}
