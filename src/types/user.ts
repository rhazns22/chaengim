export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailVerified?: boolean;
  provider?: string;
}