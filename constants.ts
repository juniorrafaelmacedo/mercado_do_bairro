
import { Supplier, Product, FinancialRecord, Trip, Invoice, User, UserRole } from './types';

export const USERS: User[] = [
  { id: 'u1', name: 'Administrador Mestre', username: 'admin', roles: [UserRole.ADMIN], password: '123' },
  { id: 'u2', name: 'Ana Souza (Fin/Comp)', username: 'ana', roles: [UserRole.FINANCE, UserRole.PURCHASING], password: '123' },
  { id: 'u3', name: 'Carlos Lima (Compras)', username: 'carlos', roles: [UserRole.PURCHASING], password: '123' },
  { id: 'u4', name: 'Roberto Dias (Logística)', username: 'roberto', roles: [UserRole.LOGISTICS], password: '123' },
];

export const SUPPLIERS: Supplier[] = [
  { 
    id: '1', 
    name: 'HortiFruti Fazenda Sol', 
    cnpj: '12.345.678/0001-90', 
    city: 'São Paulo', 
    state: 'SP',
    category: 'Hortifruti',
    address: 'Estrada do Campo Limpo',
    number: '450',
    neighborhood: 'Zona Rural',
    zipCode: '04890-000',
    contactName: 'José Fazendeiro',
    contactPhone: '(11) 98888-7777'
  },
  { 
    id: '2', 
    name: 'Distribuidora Central', 
    cnpj: '98.765.432/0001-10', 
    city: 'Campinas', 
    state: 'SP',
    category: 'Mercearia',
    address: 'Av. Industrial',
    number: '1000',
    neighborhood: 'Distrito Industrial',
    zipCode: '13050-123',
    contactName: 'Maria de Vendas',
    contactPhone: '(19) 3232-1010'
  },
  { 
    id: '3', 
    name: 'Agro Verde Ltda', 
    cnpj: '11.222.333/0001-44', 
    city: 'Holambra', 
    state: 'SP',
    category: 'Hortifruti',
    address: 'Rua das Flores',
    number: '55',
    neighborhood: 'Centro',
    zipCode: '13825-000',
    contactName: 'Antônio',
    contactPhone: '(19) 99911-2233'
  },
];

export const PRODUCTS: Product[] = [
  { id: '101', code: 'TOM01', description: 'Tomate Italiano', unit: 'CX', weightPerUnit: 20 },
  { id: '102', code: 'ALF01', description: 'Alface Americana', unit: 'CX', weightPerUnit: 8 },
  { id: '103', code: 'BAT01', description: 'Batata Inglesa', unit: 'SC', weightPerUnit: 50 },
];

export const FINANCIAL_RECORDS: FinancialRecord[] = [
  { id: 'f1', invoiceId: 'inv1', supplierId: '1', documentNumber: 'DUP-1020/1', dueDate: '2023-10-25', amount: 4500.00, status: 'PENDING', paymentMethod: 'BOLETO' },
  { id: 'f2', invoiceId: 'inv2', supplierId: '2', documentNumber: 'PIX-9988', dueDate: '2023-10-20', amount: 1200.50, status: 'PAID', paymentMethod: 'PIX' },
  { id: 'f3', invoiceId: 'inv3', supplierId: '3', documentNumber: 'DUP-3344/1', dueDate: '2023-10-28', amount: 8900.00, status: 'PENDING', paymentMethod: 'BOLETO' },
  { id: 'f4', invoiceId: 'inv4', supplierId: '1', documentNumber: 'DUP-1021/1', dueDate: '2023-10-15', amount: 3100.00, status: 'OVERDUE', paymentMethod: 'TRANSFER' },
];

export const TRIPS: Trip[] = [
  { id: 't1', code: 'V-2023-088', driver: 'Carlos Silva', licensePlate: 'ABC-1234', transporter: 'TransRapido', date: '2023-10-20', freightCost: 1500.00, totalWeight: 12000, invoices: ['inv1', 'inv2'] },
  { id: 't2', code: 'V-2023-089', driver: 'Roberto Dias', licensePlate: 'XYZ-9876', transporter: 'Logistica Sul', date: '2023-10-22', freightCost: 2200.00, totalWeight: 18500, invoices: ['inv3'] },
];

export const INVOICES: Invoice[] = [
  { id: 'inv1', number: '001.234', supplierId: '1', issueDate: '2023-10-18', dueDate: '2023-10-25', totalValue: '4500.00', items: [], tripId: 't1', status: 'CONFIRMED' },
  { id: 'inv2', number: '005.678', supplierId: '2', issueDate: '2023-10-19', dueDate: '2023-10-20', totalValue: '1200.50', items: [], tripId: 't1', status: 'CONFIRMED' },
  { id: 'inv3', number: '009.999', supplierId: '3', issueDate: '2023-10-21', dueDate: '2023-10-28', totalValue: '8900.00', items: [], tripId: 't2', status: 'CONFIRMED' },
  { id: 'inv4', number: '001.235', supplierId: '1', issueDate: '2023-10-05', dueDate: '2023-10-15', totalValue: '3100.00', items: [], status: 'CONFIRMED', attachmentUrl: 'boleto_vencido.pdf' },
];