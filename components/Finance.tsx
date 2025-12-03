import React, { useState } from 'react';
import { FinancialRecord, Supplier, Invoice } from '../types';
import { Filter, DollarSign, Calendar, CheckCircle, Eye, CornerUpLeft, X, Paperclip, Pencil } from 'lucide-react';

interface FinanceProps {
  records: FinancialRecord[];
  suppliers: Supplier[];
  invoices: Invoice[];
  onReturnInvoice: (id: string) => void;
  onPayRecord: (id: string) => void;
  onEditInvoice: (invoiceId: string) => void;
}

const Finance: React.FC<FinanceProps> = ({ 
  records, 
  suppliers, 
  invoices, 
  onReturnInvoice,
  onPayRecord,
  onEditInvoice
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null);

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || 'Fornecedor Desconhecido';

  const filteredRecords = records.filter(record => {
    if (filterStatus === 'ALL') return true;
    return record.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID': return 'PAGO';
      case 'PENDING': return 'PENDENTE';
      case 'OVERDUE': return 'VENCIDO';
      case 'ALL': return 'TODOS';
      default: return status;
    }
  }

  // Helper para buscar a invoice completa baseada no ID do registro financeiro
  const handleViewInvoice = (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) {
      alert("Erro: A Nota Fiscal original não foi encontrada no banco de dados de Compras.");
      return;
    }
    setViewInvoiceId(invoiceId);
  }

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (viewInvoiceId) {
      if (window.confirm("ATENÇÃO: Deseja realmente estornar este lançamento?\n\n- O título financeiro será EXCLUÍDO.\n- A Nota Fiscal voltará para status ABERTA no módulo de Compras.")) {
        // Fechar modal antes de executar a ação para evitar conflitos visuais
        setViewInvoiceId(null);
        setTimeout(() => {
           onReturnInvoice(viewInvoiceId);
           alert("Lançamento estornado com sucesso! A nota agora está 'Aberta' em Compras.");
        }, 100);
      }
    }
  }

  const handlePayment = (e: React.MouseEvent, recordId: string, amount: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Confirma o pagamento deste título no valor de R$ ${amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}?`)) {
      onPayRecord(recordId);
      setTimeout(() => alert("Pagamento registrado com sucesso!"), 100);
    }
  };

  const handleEditClick = () => {
    if (viewInvoiceId) {
       setViewInvoiceId(null);
       setTimeout(() => {
         onEditInvoice(viewInvoiceId);
       }, 100);
    }
  };

  const selectedInvoice = invoices.find(i => i.id === viewInvoiceId);
  const selectedRecord = records.find(r => r.invoiceId === viewInvoiceId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contas a Pagar</h2>
          <p className="text-gray-500">Gerencie títulos financeiros e pagamentos</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
          {(['ALL', 'PENDING', 'OVERDUE', 'PAID'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterStatus === status 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fornecedor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{record.documentNumber}</div>
                    <div className="text-xs text-gray-500">Ref: NF #{record.invoiceId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getSupplierName(record.supplierId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(record.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {record.paymentMethod}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button 
                         type="button"
                         onClick={() => handleViewInvoice(record.invoiceId)}
                         className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded" 
                         title="Ver NF"
                       >
                         <Eye size={18} />
                       </button>
                       {record.status !== 'PAID' && (
                        <button 
                          type="button"
                          onClick={(e) => handlePayment(e, record.id, record.amount)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 p-1 hover:bg-blue-50 rounded"
                          title="Realizar Pagamento"
                        >
                          <DollarSign size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum registro encontrado para o filtro selecionado.
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {viewInvoiceId && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Visualização de Nota Fiscal</h3>
              <button onClick={() => setViewInvoiceId(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
               <div className="bg-white border border-gray-200 p-6 shadow-sm rounded-lg space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-4">
                     <div>
                        <p className="text-xs text-gray-400 uppercase">Fornecedor</p>
                        <p className="font-bold text-lg text-gray-800">{getSupplierName(selectedInvoice.supplierId)}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">NF Nº</p>
                        <p className="font-mono font-bold text-gray-800">{selectedInvoice.number}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs text-gray-400 uppercase">Emissão</p>
                        <p className="font-medium text-gray-700">{new Date(selectedInvoice.issueDate).toLocaleDateString('pt-BR')}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-400 uppercase">Vencimento</p>
                        <p className="font-medium text-gray-700">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('pt-BR') : '-'}
                        </p>
                     </div>
                  </div>

                  <div className="pt-2">
                     <p className="text-xs text-gray-400 uppercase">Valor Total</p>
                     <p className="text-2xl font-bold text-gray-900">R$ {parseFloat(selectedInvoice.totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>

                  {selectedInvoice.attachmentUrl && (
                     <div className="bg-blue-50 p-3 rounded border border-blue-100 flex items-center gap-2 text-blue-700 text-sm">
                        <Paperclip size={16} />
                        Arquivo Anexo: <span className="underline cursor-pointer">{selectedInvoice.attachmentUrl}</span>
                     </div>
                  )}

                  <div className="bg-green-50 p-3 rounded border border-green-100 text-center">
                     <span className="text-green-700 font-bold flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Nota Conferida
                     </span>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3 flex-wrap">
               <button type="button" onClick={() => setViewInvoiceId(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                  Fechar
               </button>
               
               <button 
                  type="button" 
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
               >
                  <Pencil size={18} /> Editar no Compras
               </button>

               {selectedRecord?.status !== 'PAID' && (
                 <button 
                   type="button"
                   onClick={handleReturn}
                   className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2"
                 >
                   <CornerUpLeft size={18} /> Estornar
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;