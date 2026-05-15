export interface User {
  _id: string;
  email: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  createdAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  body: string;
  sentBy: string;
  status: 'sent' | 'failed';
  sentAt: string;
}

export interface AuthResponse {
  _id: string;
  email: string;
  token: string;
  lastLoginAt?: string;
}
