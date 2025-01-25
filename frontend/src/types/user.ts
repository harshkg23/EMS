export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'regular';
  status: 'active' | 'inactive';
  joinDate: string;
}