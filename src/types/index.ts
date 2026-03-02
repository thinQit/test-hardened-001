export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'spam' | string;
  createdAt?: string;
  ipAddress?: string | null;
}
