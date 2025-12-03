
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { FinancialRecord, Supplier, Trip } from '../types';
import { 
  TrendingUp, AlertCircle, Wallet, Calendar, Filter, 
  ArrowUpRight, ArrowDownRight, DollarSign, List 
} from 'lucide-react';

interface DashboardProps {
  financialRecords: FinancialRecord[];
  suppliers: Supplier[];
  trips: Trip[];
}

const COLORS = {
  PAID: '#10B981',    // Verde
  PENDING: '#F59E0B', // Amarelo
  OVERDUE: '#EF4444', // Vermelho
  BLUE: '#3B82F6',
  PURPLE: '#8B5CF6'
};

const Dashboard: React.FC<DashboardProps> = ({ financialRecords, suppliers, trips }) => {
  // Configuração inicial de datas (Mês atual como padrão)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  // --- LÓGICA DE FILTRAGEM ---
  
  const filteredRecords = useMemo(() => {
    return financialRecords.filter(record => {
      if (!startDate || !endDate) return true;
      return record.dueDate >= startDate && record.dueDate <= endDate;
    });
  }, [financialRecords, startDate, endDate]);

  // --- CÁLCULOS DE KPI (Baseados no Filtro) ---

  const kpis = useMemo(() => {
    let total = 0;
    let paid = 0;
    let overdue = 0;
    let pending = 0;

    filteredRecords.forEach(r => {
      total += r.amount;
      if (r.status === 'PAID') paid += r.amount;
      else if (r.status === 'OVERDUE') overdue += r.amount;
      else pending += r.amount;
    });

    return { total, paid, overdue, pending };
  }, [filteredRecords]);

  // --- DADOS PARA GRÁFICOS ---

  // 1. Distribuição de Status (Pizza)
  const statusData = [
    { name: 'Pago', value: kpis.paid, color: COLORS.PAID },
    { name: 'Pendente', value: kpis.pending, color: COLORS.PENDING },
    { name: 'Vencido', value: kpis.overdue, color: COLORS.OVERDUE },
  ].filter(d => d.value > 0);

  // 2. Gastos por Fornecedor (Barra)
  const supplierData = useMemo(() => {
    const expenses = filteredRecords.reduce((acc: Record<string, number>, record) => {
      const name = suppliers.find(s => s.id === record.supplierId)?.name || 'Outros';
      acc[name] = (acc[name] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expenses)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => Number(b.value) - Number(a.value))
      .slice(0, 5); // Top 5
  }, [filteredRecords, suppliers]);

  // 3. Evolução de Pagamentos no Tempo (Linha)
  const timelineData = useMemo(() => {
    const daily = filteredRecords.reduce((acc: Record<string, number>, record) => {
      const date = new Date(record.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      acc[date] = (acc[date] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

    // Ordenar por data (precisaria de lógica mais robusta para anos diferentes, mas serve para mês)
    return Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const partsA = a.date.split('/').map(Number);
        const partsB = b.date.split('/').map(Number);
        const dayA = partsA[0] || 0;
        const monthA = partsA[1] || 0;
        const dayB = partsB[0] || 0;
        const monthB = partsB[1] || 0;
        return (monthA - monthB) || (dayA - dayB);
      });
  }, [filteredRecords]);

  // Formatação de Moeda
  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER DE CONTROLE E FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             <Filter size={20} className="text-gray-500" />
             Painel Gerencial Customizável
           </h2>
           <p className="text-sm text-gray-500">Defina o período para analisar seus indicadores</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
           <div className="flex flex-col">
              <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Início</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-2 py-1 outline-none focus:border-blue-500"
              />
           </div>
           <span className="text-gray-400">-</span>
           <div className="flex flex-col">
              <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Fim</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-2 py-1 outline-none focus:border-blue-500"
              />
           </div>
           <button 
             onClick={() => { setStartDate(''); setEndDate(''); }}
             className="ml-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
             title="Limpar Filtros (Ver Tudo)"
           >
             <Filter size={16} className="strikethrough" />
           </button>
        </div>
      </div>

      {/* CARDS DE KPI (Resumo do Período) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Total Previsto</p>
                 <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(kpis.total)}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={20} /></div>
           </div>
           <div className="mt-4 text-xs text-gray-400">No período selecionado</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Total Pago</p>
                 <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(kpis.paid)}</h3>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
           </div>
           <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
              <ArrowUpRight size={14} className="mr-1" /> 
              {kpis.total > 0 ? ((kpis.paid / kpis.total) * 100).toFixed(1) : 0}% do total
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Aberto (Pendente)</p>
                 <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(kpis.pending)}</h3>
              </div>
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Calendar size={20} /></div>
           </div>
           <div className="mt-4 text-xs text-gray-400">A vencer no período</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs text-gray-500 uppercase font-bold">Vencido / Atrasado</p>
                 <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(kpis.overdue)}</h3>
              </div>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
           </div>
           <div className="mt-4 flex items-center text-xs text-red-600 font-medium">
              <ArrowDownRight size={14} className="mr-1" /> 
              {kpis.total > 0 ? ((kpis.overdue / kpis.total) * 100).toFixed(1) : 0}% de inadimplência
           </div>
        </div>
      </div>

      {/* ÁREA GRÁFICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Evolução Financeira (Timeline) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <TrendingUp size={18} className="text-blue-600" />
             Fluxo de Contas (Evolução Diária)
           </h3>
           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={timelineData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                 <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} tick={{fontSize: 12, fill: '#6b7280'}} />
                 <Tooltip 
                    formatter={(val: number) => formatCurrency(val)} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                 />
                 <Legend />
                 <Line type="monotone" dataKey="amount" name="Valor a Pagar/Pago" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Gráfico 2: Status Pizza */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <PieChart size={18} className="text-purple-600" />
             Proporção por Status
           </h3>
           <div className="h-64 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                   <span className="text-xs text-gray-400 uppercase font-semibold">Total</span>
                   <p className="text-lg font-bold text-gray-800">
                     {filteredRecords.length} <span className="text-xs font-normal">Títulos</span>
                   </p>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Gráfico 3: Top Fornecedores */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <List size={18} className="text-indigo-600" />
              Top 5 Fornecedores (Gastos)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData} layout="vertical" margin={{left: 20}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Lista: Próximos Vencimentos ou Vencidos */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
               <AlertCircle size={18} className="text-red-500" />
               Atenção: Títulos Vencidos ou Próximos
             </h3>
             <div className="overflow-y-auto max-h-60">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 sticky top-0">
                      <tr>
                         <th className="px-3 py-2 text-xs font-semibold text-gray-500">Vencimento</th>
                         <th className="px-3 py-2 text-xs font-semibold text-gray-500">Fornecedor</th>
                         <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-right">Valor</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {filteredRecords
                        .filter(r => r.status !== 'PAID')
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .slice(0, 10)
                        .map(r => (
                          <tr key={r.id} className="hover:bg-gray-50">
                             <td className={`px-3 py-2 text-sm ${r.status === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                {new Date(r.dueDate).toLocaleDateString('pt-BR')}
                             </td>
                             <td className="px-3 py-2 text-sm text-gray-700 truncate max-w-[150px]">
                                {suppliers.find(s => s.id === r.supplierId)?.name}
                             </td>
                             <td className="px-3 py-2 text-sm text-gray-900 font-medium text-right">
                                {formatCurrency(r.amount)}
                             </td>
                          </tr>
                        ))}
                      {filteredRecords.filter(r => r.status !== 'PAID').length === 0 && (
                        <tr>
                           <td colSpan={3} className="px-3 py-8 text-center text-gray-400 text-sm">
                             Nenhum título pendente no período.
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
    