
export enum UserRole {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  ficha: string;
  name: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'ENTRADA' | 'SALIDA';
  material: string;
  lot: string;
  quantity: number;
  sourceDest: string;
  observations: string;
  createdBy: string;
}

export interface Material {
  id?: number;
  name: string;
}

export type AppTab = 'dashboard' | 'entrada' | 'salida' | 'reportes' | 'config' | 'users';
