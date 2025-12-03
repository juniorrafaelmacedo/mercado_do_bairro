
export enum UserRole {
  ADMIN = 'ADMIN',
  PURCHASING = 'PURCHASING',
  FINANCE = 'FINANCE',
  LOGISTICS = 'LOGISTICS'
}

export interface User {
  id: string;
  name: string;
  username: string;
  roles: UserRole[]; 
  password?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  category: 'Hortifruti' | 'Mercearia' | 'Limpeza' | 'Outros';
  // Address
  zipCode?: string;
  address?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state?: string;
  // Contact
  contactName?: string;
  contactPhone?: string;
}

export interface Product {
  id: string;
  code: string;
  description: string;
  unit: 'KG' | 'CX' | 'UN' | 'SC';
  weightPerUnit: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  totalWeight: number;
}

export interface Invoice {
  id: string;
  number: string;
  supplierId: string;
  issueDate: string;
  dueDate?: string; // Novo campo de vencimento
  totalValue: string; // Mantendo como string para input fácil, converter quando necessário
  items: InvoiceItem[];
  tripId?: string;
  status: 'OPEN' | 'CONFIRMED';
  attachmentUrl?: string; // Nome do arquivo simulado
}

export interface FinancialRecord {
  id: string;
  invoiceId: string;
  supplierId: string;
  documentNumber: string;
  dueDate: string;
  paymentDate?: string; // Data em que o título foi pago
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paymentMethod: 'BOLETO' | 'PIX' | 'TRANSFER' | 'CASH';
}

export interface Trip {
  id: string;
  code: string;
  driver: string;
  licensePlate: string;
  transporter: string;
  date: string;
  freightCost: number;
  totalWeight: number;
  invoices: string[];
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PURCHASES = 'PURCHASES',
  FINANCE = 'FINANCE',
  LOGISTICS = 'LOGISTICS',
  SETTINGS = 'SETTINGS'
}