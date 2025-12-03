

import React, { useState, useEffect } from 'react';
import { ViewState, UserRole, User, Invoice, Supplier, Product, FinancialRecord, Trip } from './types';
import { SUPPLIERS, FINANCIAL_RECORDS, TRIPS, INVOICES, USERS, PRODUCTS } from './constants';
import Dashboard from './components/Dashboard';
import Finance from './components/Finance';
import Logistics from './components/Logistics';
import Purchases from './components/Purchases';
import UserManagement from './components/UserManagement';
import { LayoutDashboard, ShoppingCart, DollarSign, Truck, LogOut, Settings, Users } from 'lucide-react';
import clsx from 'clsx';

// --- Hook Personalizado para Persistência (LocalStorage) ---
// Isso simula um banco de dados salvando no navegador do usuário
function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar nosso valor
  // Passa a função de estado inicial para useState para que a lógica só execute uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Obter do armazenamento local pela chave
      const item = window.localStorage.getItem(key);
      // Analisar o JSON armazenado ou, se nenhum retornar, initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma versão encapsulada da função setter do useState que ...
  // ... persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Salvar estado
      setStoredValue(valueToStore);
      
      // Salvar no local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Componente de Logo (SVG Vetorial - Versão Detalhada Customizada)
const MercadoLogo = ({ className }: { className?: string }) => (
  <svg 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 800 450"
    className={className}
    role="img"
    aria-label="Mercado do Bairro Logo"
  >
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCEABB" stopOpacity="1" />
        <stop offset="50%" stopColor="#F8B500" stopOpacity="1" />
        <stop offset="100%" stopColor="#CCA033" stopOpacity="1" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect width="100%" height="100%" fill="#0A1128" rx="20" ry="20" />

    <path d="M50,120 C50,100 70,100 100,100 H700 C730,100 750,100 750,120 V140 C770,140 780,150 780,170 V280 C780,300 770,310 750,310 V330 C750,350 730,350 700,350 H100 C70,350 50,350 50,330 V310 C30,310 20,300 20,280 V170 C20,150 30,140 50,140 Z" fill="#1A2B4D" stroke="#28395E" strokeWidth="4"/>

    <g transform="translate(400, 135)">
      <circle cx="0" cy="0" r="75" fill="none" stroke="url(#goldGrad)" strokeWidth="6" filter="url(#glow)"/>
      <circle cx="0" cy="0" r="70" fill="#4A3B2A" stroke="#2A1B0A" strokeWidth="2"/>

      <g transform="translate(-35, -40) rotate(-5)">
        <path d="M15,5 C15,-20 55,-20 55,5" fill="none" stroke="#C1272D" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20,5 C20,-15 50,-15 50,5" fill="none" stroke="#961E22" strokeWidth="4" strokeLinecap="round"/>
        <polygon points="5,5 65,5 75,75 -5,75" fill="#B58B57" stroke="#8C6A43" strokeWidth="2"/>
        <text x="35" y="30" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="7" fill="white" textAnchor="middle" transform="rotate(-8 35,35)">
          <tspan x="35" dy="0">Onde tem</tspan>
          <tspan x="35" dy="9">Paixão, tem</tspan>
          <tspan x="35" dy="9">Satisfação!</tspan>
        </text>
      </g>
    </g>

    <g transform="translate(400, 135)">
       <path d="M-90,-20 Q-110,-40 -90,-60 Q-70,-40 -90,-20 Z" fill="url(#goldGrad)"/>
       <path d="M90,-20 Q110,-40 90,-60 Q70,-40 90,-20 Z" fill="#C1272D"/>
       <path d="M-80,20 Q-100,40 -80,60 Q-60,40 -80,20 Z" fill="#C1272D"/>
       <path d="M80,20 Q100,40 80,60 Q60,40 80,20 Z" fill="url(#goldGrad)"/>
    </g>

    <text x="400" y="260" fontFamily="'Kaushan Script', cursive" fontSize="100" fill="white" textAnchor="middle" stroke="#0A1128" strokeWidth="2" paintOrder="stroke">Mercado</text>
    <text x="400" y="340" fontFamily="'Kaushan Script', cursive" fontSize="100" fill="white" textAnchor="middle" stroke="#0A1128" strokeWidth="2" paintOrder="stroke">do Bairro</text>
  </svg>
);

function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Data State - AGORA USANDO LOCALSTORAGE (Persistência)
  // As chaves 'erp_users', 'erp_suppliers', etc., garantem que os dados fiquem salvos no navegador
  const [users, setUsers] = useLocalStorage<User[]>('erp_users', USERS);
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('erp_suppliers', SUPPLIERS);
  const [products, setProducts] = useLocalStorage<Product[]>('erp_products', PRODUCTS);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('erp_invoices', INVOICES);
  const [financialRecords, setFinancialRecords] = useLocalStorage<FinancialRecord[]>('erp_financial', FINANCIAL_RECORDS);
  const [trips, setTrips] = useLocalStorage<Trip[]>('erp_trips', TRIPS);

  // Estado para navegação entre Financeiro -> Edição em Compras
  const [invoiceToEdit, setInvoiceToEdit] = useState<string | null>(null);

  // Handlers de Login
  const handleLogin = () => {
    // Comparação direta sem conversão forçada
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setView(ViewState.DASHBOARD);
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha inválidos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setView(ViewState.LOGIN);
  };

  // Handlers de Gestão de Usuários
  const handleAddUser = (newUser: User) => setUsers(prev => [...prev, newUser]);
  const handleUpdateUser = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  const handleDeleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  // Handlers de Compras (Fornecedores, Produtos, NFs)
  const handleAddSupplier = (s: Supplier) => setSuppliers(prev => [...prev, s]);
  const handleAddProduct = (p: Product) => setProducts(prev => [...prev, p]);
  
  // Handlers de Logística
  const handleAddTrip = (newTrip: Trip) => setTrips(prev => [newTrip, ...prev]);

  // Lógica Central: Salvar Nota Fiscal (Criar, Atualizar ou Estornar Financeiro)
  const handleSaveInvoice = (inv: Invoice) => {
    // 1. Atualizar ou Adicionar na lista de Notas Fiscais
    setInvoices(prevInvoices => {
      const exists = prevInvoices.some(i => i.id === inv.id);
      if (exists) {
        return prevInvoices.map(i => i.id === inv.id ? inv : i);
      } else {
        return [...prevInvoices, inv];
      }
    });

    // 2. Gerenciar Registro Financeiro
    setFinancialRecords(prevRecords => {
      const existingRecordIndex = prevRecords.findIndex(r => r.invoiceId === inv.id);

      if (inv.status === 'CONFIRMED') {
        // Lógica de CRIAÇÃO ou ATUALIZAÇÃO do título
        const recordData: FinancialRecord = {
          id: existingRecordIndex >= 0 ? prevRecords[existingRecordIndex].id : Math.random().toString(36).substr(2, 9),
          invoiceId: inv.id,
          supplierId: inv.supplierId,
          documentNumber: inv.number,
          dueDate: inv.dueDate || new Date().toISOString().split('T')[0],
          amount: parseFloat(inv.totalValue),
          // Mantém status se já existir, senão cria como PENDING
          status: existingRecordIndex >= 0 ? prevRecords[existingRecordIndex].status : 'PENDING',
          paymentMethod: existingRecordIndex >= 0 ? prevRecords[existingRecordIndex].paymentMethod : 'BOLETO'
        };

        if (existingRecordIndex >= 0) {
          // Atualiza registro existente (caso valor ou vencimento tenha mudado na NF)
          const updatedRecords = [...prevRecords];
          updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], ...recordData };
          return updatedRecords;
        } else {
          // Cria novo registro financeiro
          return [...prevRecords, recordData];
        }
      } else {
        // Status OPEN (Estorno/Desmarcou conferência)
        // Se existir registro financeiro, remove-o
        if (existingRecordIndex >= 0) {
          return prevRecords.filter(r => r.invoiceId !== inv.id);
        }
        return prevRecords;
      }
    });
  };

  // Lógica de "Devolução" do Financeiro (Atalho via botão estornar)
  const handleReturnInvoice = (invoiceId: string) => {
    if (!invoiceId) return;
    
    // 1. Reabre a Nota Fiscal (Status OPEN)
    setInvoices(prevInvoices => prevInvoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'OPEN' } : inv
    ));

    // 2. Remove o registro Financeiro associado (Estorno)
    setFinancialRecords(prevRecords => prevRecords.filter(r => r.invoiceId !== invoiceId));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(i => i.id !== id));
    // Remove do financeiro se existir, para garantir integridade
    setFinancialRecords(prevRecords => prevRecords.filter(r => r.invoiceId !== id));
  };

  // Lógica de Pagamento
  const handlePayRecord = (recordId: string, paymentDate?: string) => {
    const dateValue = paymentDate || new Date().toISOString().split('T')[0];
    setFinancialRecords(prevRecords => prevRecords.map(r => 
      r.id === recordId ? { ...r, status: 'PAID', paymentDate: dateValue } : r
    ));
  };

  // Reabrir título pago (voltar para PENDING e remover paymentDate)
  const handleReopenRecord = (recordId: string) => {
    setFinancialRecords(prevRecords => prevRecords.map(r => 
      r.id === recordId ? { ...r, status: 'PENDING', paymentDate: undefined } : r
    ));
  };

  // Navegação Financeiro -> Compras (Edição)
  const handleEditFromFinance = (invoiceId: string) => {
    setInvoiceToEdit(invoiceId);
    setView(ViewState.PURCHASES);
  };

  const handleClearInvoiceToEdit = () => {
    setInvoiceToEdit(null);
  };

  // Check permissions
  const canAccess = (userRoles: UserRole[], targetView: ViewState): boolean => {
    if (userRoles.includes(UserRole.ADMIN)) return true;
    if (targetView === ViewState.DASHBOARD) return true;
    switch (targetView) {
      case ViewState.FINANCE: return userRoles.includes(UserRole.FINANCE);
      case ViewState.PURCHASES: return userRoles.includes(UserRole.PURCHASING);
      case ViewState.LOGISTICS: return userRoles.includes(UserRole.LOGISTICS);
      default: return false;
    }
  };

  const getUserRoleLabel = (roles: UserRole[]) => {
    if (roles.includes(UserRole.ADMIN)) return 'Administrador';
    return roles.map(r => {
      switch(r) {
        case UserRole.FINANCE: return 'Financeiro';
        case UserRole.PURCHASING: return 'Compras';
        case UserRole.LOGISTICS: return 'Logística';
        default: return '';
      }
    }).join(' & ');
  };

  const NavItem = ({ targetView, icon: Icon, label }: { targetView: ViewState, icon: any, label: string }) => {
    if (!currentUser || !canAccess(currentUser.roles, targetView)) return null;
    return (
      <button
        onClick={() => setView(targetView)}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
          view === targetView 
            ? "bg-green-600 text-white shadow-md" 
            : "text-gray-600 hover:bg-green-50 hover:text-green-700"
        )}
      >
        <Icon size={20} />
        <span className={clsx(!isSidebarOpen && "hidden", "font-medium")}>{label}</span>
      </button>
    );
  };

  if (view === ViewState.LOGIN || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
          <div className="bg-white p-8 text-center border-b border-gray-100 flex flex-col items-center">
            <div className="w-full mb-4">
               <MercadoLogo className="w-full h-auto drop-shadow-md" />
            </div>
            <p className="text-gray-500">Sistema de Gestão Integrada (ERP)</p>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="Ex: admin" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="Ex: 123" 
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{loginError}</p>
            )}
            <button 
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside 
        className={clsx(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed md:relative z-20 h-full",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-4 flex items-center justify-center border-b border-gray-100 h-32">
          <div className={clsx("transition-all duration-300 flex items-center justify-center", isSidebarOpen ? "w-full scale-100" : "w-10 scale-75 opacity-0")}>
             <MercadoLogo className="w-full h-auto max-h-24" />
          </div>
          {!isSidebarOpen && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-green-700 font-['Kaushan_Script']">MB</span>
             </div>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem targetView={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem targetView={ViewState.PURCHASES} icon={ShoppingCart} label="Compras" />
          <NavItem targetView={ViewState.FINANCE} icon={DollarSign} label="Financeiro" />
          <NavItem targetView={ViewState.LOGISTICS} icon={Truck} label="Logística" />
          <div className="pt-8 mt-4 border-t border-gray-100">
             <NavItem targetView={ViewState.SETTINGS} icon={Settings} label="Configurações" />
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className={clsx(!isSidebarOpen && "hidden", "font-medium")}>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {view === ViewState.DASHBOARD && 'Visão Geral'}
              {view === ViewState.PURCHASES && 'Gestão de Compras'}
              {view === ViewState.FINANCE && 'Controle Financeiro'}
              {view === ViewState.LOGISTICS && 'Logística e Transporte'}
              {view === ViewState.SETTINGS && 'Configurações do Sistema'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-800">{currentUser.name}</span>
                <span className="text-xs text-gray-500">{getUserRoleLabel(currentUser.roles)}</span>
             </div>
             <div className="w-10 h-10 bg-green-100 rounded-full overflow-hidden border-2 border-green-200 shadow-sm flex items-center justify-center text-green-700 font-bold">
                {currentUser.name.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-24">
          {view === ViewState.DASHBOARD && (
            <Dashboard financialRecords={financialRecords} suppliers={suppliers} trips={trips} />
          )}
          {view === ViewState.FINANCE && (
            <Finance 
              records={financialRecords} 
              suppliers={suppliers} 
              invoices={invoices}
              onReturnInvoice={handleReturnInvoice}
              onPayRecord={handlePayRecord}
              onReopenRecord={handleReopenRecord}
              onEditInvoice={handleEditFromFinance}
            />
          )}
          {view === ViewState.LOGISTICS && (
            <Logistics trips={trips} onAddTrip={handleAddTrip} />
          )}
          {view === ViewState.PURCHASES && (
            <Purchases 
              invoices={invoices} 
              suppliers={suppliers} 
              products={products}
              onSaveInvoice={handleSaveInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onAddSupplier={handleAddSupplier}
              onAddProduct={handleAddProduct}
              invoiceToEdit={invoiceToEdit}
              onClearInvoiceToEdit={handleClearInvoiceToEdit}
            />
          )}
          {view === ViewState.SETTINGS && (
            <div className="space-y-8 animate-fade-in">
              {currentUser.roles.includes(UserRole.ADMIN) ? (
                 <UserManagement 
                    users={users} 
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                 />
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                   <p className="text-yellow-700">Você não tem permissão para gerenciar usuários.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
