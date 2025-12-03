
import React, { useState, useEffect } from 'react';
import { Invoice, Supplier, Product } from '../types';
import { FileText, Plus, Search, Trash2, Download, Paperclip, X, Package, Store, Calendar, DollarSign, Pencil, CheckCircle, Lock, AlertTriangle, MapPin, Phone, User } from 'lucide-react';

interface PurchasesProps {
  invoices: Invoice[];
  suppliers: Supplier[];
  products: Product[];
  onSaveInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onAddSupplier: (supplier: Supplier) => void;
  onAddProduct: (product: Product) => void;
  invoiceToEdit?: string | null;
  onClearInvoiceToEdit?: () => void;
}

const Purchases: React.FC<PurchasesProps> = ({ 
  invoices, 
  suppliers, 
  products,
  onSaveInvoice,
  onDeleteInvoice,
  onAddSupplier,
  onAddProduct,
  invoiceToEdit,
  onClearInvoiceToEdit
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'suppliers' | 'products'>('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  
  // States for Invoice Form
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    status: 'OPEN',
    items: []
  });
  const [attachmentName, setAttachmentName] = useState('');

  // States for Supplier Form
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ category: 'Hortifruti' });

  // States for Product Form
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ unit: 'CX' });

  // Efeito para abrir o modal automaticamente quando solicitado pelo Financeiro
  useEffect(() => {
    if (invoiceToEdit) {
      const inv = invoices.find(i => i.id === invoiceToEdit);
      if (inv) {
        setEditingInvoiceId(inv.id);
        setNewInvoice({ ...inv });
        setAttachmentName(inv.attachmentUrl || '');
        setShowInvoiceModal(true);
        setActiveTab('invoices');
      }
      // Limpa a solicitação para evitar loop
      if (onClearInvoiceToEdit) onClearInvoiceToEdit();
    }
  }, [invoiceToEdit, invoices, onClearInvoiceToEdit]);

  // --- Handlers ---

  const handleOpenNewInvoice = () => {
    setEditingInvoiceId(null);
    setNewInvoice({ status: 'OPEN', items: [] });
    setAttachmentName('');
    setShowInvoiceModal(true);
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setNewInvoice({ ...invoice });
    setAttachmentName(invoice.attachmentUrl || '');
    setShowInvoiceModal(true);
  }

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.number || !newInvoice.supplierId || !newInvoice.issueDate || !newInvoice.totalValue || !newInvoice.dueDate) {
      alert("Preencha os campos obrigatórios, incluindo o vencimento.");
      return;
    }
    
    const invoice: Invoice = {
      id: editingInvoiceId || Math.random().toString(36).substr(2, 9),
      number: newInvoice.number!,
      supplierId: newInvoice.supplierId!,
      issueDate: newInvoice.issueDate!,
      dueDate: newInvoice.dueDate!,
      totalValue: newInvoice.totalValue!,
      status: newInvoice.status || 'OPEN',
      items: newInvoice.items || [],
      attachmentUrl: attachmentName,
      tripId: newInvoice.tripId
    };
    
    onSaveInvoice(invoice);
    setShowInvoiceModal(false);
    setNewInvoice({ status: 'OPEN', items: [] });
    setAttachmentName('');
    setEditingInvoiceId(null);
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.cnpj || !newSupplier.city) return;
    onAddSupplier({
      id: Math.random().toString(36).substr(2, 9),
      name: newSupplier.name,
      cnpj: newSupplier.cnpj,
      category: newSupplier.category || 'Outros',
      // Address
      city: newSupplier.city,
      address: newSupplier.address,
      number: newSupplier.number,
      neighborhood: newSupplier.neighborhood,
      state: newSupplier.state,
      zipCode: newSupplier.zipCode,
      // Contact
      contactName: newSupplier.contactName,
      contactPhone: newSupplier.contactPhone
    });
    setShowSupplierModal(false);
    setNewSupplier({ category: 'Hortifruti' });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.code || !newProduct.description || !newProduct.weightPerUnit) return;
    onAddProduct({
      id: Math.random().toString(36).substr(2, 9),
      code: newProduct.code,
      description: newProduct.description,
      unit: newProduct.unit || 'CX',
      weightPerUnit: Number(newProduct.weightPerUnit)
    });
    setShowProductModal(false);
    setNewProduct({ unit: 'CX' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  // Função para aplicar máscara de CPF ou CNPJ
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 14) value = value.slice(0, 14);

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setNewSupplier({ ...newSupplier, cnpj: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Máscara (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
    }
    if (value.length > 9) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    setNewSupplier({...newSupplier, contactPhone: value});
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    // Máscara XXXXX-XXX
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setNewSupplier({...newSupplier, zipCode: value});
  };

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'invoices') {
       csvContent += "Numero NF,Fornecedor,Emissao,Vencimento,Valor,Status,Anexo\n";
       invoices.forEach(inv => {
         const supplierName = suppliers.find(s => s.id === inv.supplierId)?.name || 'N/A';
         csvContent += `${inv.number},${supplierName},${inv.issueDate},${inv.dueDate || ''},${inv.totalValue},${inv.status},${inv.attachmentUrl || ''}\n`;
       });
    } else if (activeTab === 'suppliers') {
      csvContent += "Nome,Documento,Cidade,UF,Telefone,Representante,Categoria\n";
      suppliers.forEach(s => {
        csvContent += `${s.name},${s.cnpj},${s.city},${s.state || ''},${s.contactPhone || ''},${s.contactName || ''},${s.category}\n`;
      });
    } else {
      csvContent += "Codigo,Descricao,Unidade,Peso(kg)\n";
      products.forEach(p => {
        csvContent += `${p.code},${p.description},${p.unit},${p.weightPerUnit}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mercado_bairro_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || 'Desconhecido';

  // Helper para formatar moeda
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 'R$ 0,00' : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isConfirmed = newInvoice.status === 'CONFIRMED' && editingInvoiceId !== null;

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Compras</h2>
          <p className="text-gray-500">Cadastros e Lançamento de Notas Fiscais</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={exportToExcel}
             className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
           >
             <Download size={18} /> Excel
           </button>
           {activeTab === 'invoices' && (
             <button onClick={handleOpenNewInvoice} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm flex items-center gap-2">
               <Plus size={18} /> Nova NF
             </button>
           )}
           {activeTab === 'suppliers' && (
             <button onClick={() => setShowSupplierModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
               <Plus size={18} /> Novo Fornecedor
             </button>
           )}
           {activeTab === 'products' && (
             <button onClick={() => setShowProductModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow-sm flex items-center gap-2">
               <Plus size={18} /> Novo Produto
             </button>
           )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'invoices' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Notas Fiscais
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'suppliers' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Fornecedores
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Produtos
        </button>
      </div>

      {/* Content Area */}
      
      {/* INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition relative group">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                     <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">NF {inv.number}</h3>
                    <p className="text-xs text-gray-500">{new Date(inv.issueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${inv.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {inv.status === 'CONFIRMED' && <CheckCircle size={10} />}
                  {inv.status === 'OPEN' ? 'ABERTA' : 'CONFERIDA'}
                </span>
              </div>
              
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Fornecedor</p>
                  <p className="text-gray-700 font-medium truncate">{getSupplierName(inv.supplierId)}</p>
                </div>
                
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Vencimento</p>
                      <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                         <Calendar size={12} />
                         {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('pt-BR') : '-'}
                      </p>
                   </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Valor Total</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(inv.totalValue)}</p>
                  </div>
                </div>
                
                 {inv.attachmentUrl && (
                     <div className="pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded cursor-pointer hover:underline w-fit" title={inv.attachmentUrl}>
                          <Paperclip size={12} /> Doc Anexo
                        </div>
                     </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit Button - Enabled for ALL Invoice Statuses */}
                <button 
                  onClick={() => handleEditInvoice(inv)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 shadow-sm"
                  title="Editar Nota"
                >
                  <Pencil size={16} />
                </button>
                
                {/* Delete Button - Only if OPEN */}
                {inv.status === 'OPEN' && (
                  <button 
                    onClick={() => onDeleteInvoice(inv.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 shadow-sm"
                    title="Excluir NF Aberta"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nome / Documento</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Endereço</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contato</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4">
                     <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Store size={16} className="text-gray-400" /> {s.name}
                     </div>
                     <div className="text-xs text-gray-500 font-mono mt-1">{s.cnpj}</div>
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600">
                     <div>{s.city} - {s.state}</div>
                     {s.address && (
                        <div className="text-xs text-gray-400 mt-1">
                           {s.address}, {s.number}
                        </div>
                     )}
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600">
                     {s.contactName && (
                        <div className="flex items-center gap-1 font-medium">
                           <User size={12} /> {s.contactName}
                        </div>
                     )}
                     {s.contactPhone && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                           <Phone size={12} /> {s.contactPhone}
                        </div>
                     )}
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600">
                     <span className="bg-gray-100 px-2 py-1 rounded text-xs">{s.category}</span>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Código</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Unidade</th>
                 <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Peso Ref (Kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50 w-24 text-center rounded-r-lg">{p.code}</td>
                   <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                     <Package size={16} className="text-gray-400" />
                     {p.description}
                   </td>
                   <td className="px-6 py-4 text-sm text-gray-600">{p.unit}</td>
                   <td className="px-6 py-4 text-sm text-gray-600">{p.weightPerUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingInvoiceId ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}
              </h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            {isConfirmed && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2 text-sm text-yellow-800">
                <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Atenção:</strong> Esta nota já foi conferida. <br/>
                  - Alterações de valor atualizarão o Financeiro.<br/>
                  - Para <strong>estornar</strong>, desmarque a caixa "Nota Conferida".
                </p>
              </div>
            )}

            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                 <select 
                   className="w-full border border-gray-300 rounded-lg p-2"
                   value={newInvoice.supplierId || ''}
                   onChange={e => setNewInvoice({...newInvoice, supplierId: e.target.value})}
                   required
                 >
                   <option value="">Selecione...</option>
                   {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Número NF</label>
                   <input 
                     type="text" className="w-full border border-gray-300 rounded-lg p-2" 
                     value={newInvoice.number || ''}
                     onChange={e => setNewInvoice({...newInvoice, number: e.target.value})}
                     placeholder="000.000" required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Data Emissão</label>
                   <input 
                     type="date" className="w-full border border-gray-300 rounded-lg p-2" 
                     value={newInvoice.issueDate || ''}
                     onChange={e => setNewInvoice({...newInvoice, issueDate: e.target.value})}
                     required
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                    <input 
                      type="date" className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newInvoice.dueDate || ''}
                      onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                    <div className="relative">
                       <span className="absolute left-3 top-2 text-gray-500">R$</span>
                       <input 
                        type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-2 pl-9" 
                        value={newInvoice.totalValue || ''}
                        onChange={e => setNewInvoice({...newInvoice, totalValue: e.target.value})}
                        placeholder="0.00" required
                      />
                    </div>
                 </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anexar Documento</label>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                     <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                       <Paperclip size={16} />
                       {attachmentName || "Clique para selecionar arquivo"}
                     </p>
                  </div>
               </div>
               
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                 <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" id="statusCheck" 
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      checked={newInvoice.status === 'CONFIRMED'}
                      onChange={e => setNewInvoice({...newInvoice, status: e.target.checked ? 'CONFIRMED' : 'OPEN'})}
                    />
                    <div>
                      <label htmlFor="statusCheck" className="text-sm font-bold text-gray-800 cursor-pointer">Nota Conferida e Fechada</label>
                      <p className="text-xs text-gray-500">
                         {newInvoice.status === 'CONFIRMED' 
                           ? "Marcado: Gerará/Atualizará título financeiro." 
                           : "Desmarcado: Estornará título financeiro se existir."}
                      </p>
                    </div>
                 </div>
               </div>

               <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 mt-4">
                 {editingInvoiceId ? 'Salvar e Atualizar Financeiro' : 'Salvar Nota Fiscal'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Cadastrar Fornecedor</h3>
              <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSupplierSubmit} className="space-y-6">
              {/* Section: Dados Cadastrais */}
              <div>
                 <h4 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-100 pb-2 mb-3">Dados Cadastrais</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="col-span-1 md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia / Razão Social</label>
                     <input required type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.name || ''} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
                     <input 
                       required 
                       type="text" 
                       className="w-full border border-gray-300 rounded-lg p-2" 
                       value={newSupplier.cnpj || ''} 
                       onChange={handleDocumentChange}
                       placeholder="Somente números"
                     />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.category} onChange={e => setNewSupplier({...newSupplier, category: e.target.value as any})}>
                        <option value="Hortifruti">Hortifruti</option>
                        <option value="Mercearia">Mercearia</option>
                        <option value="Limpeza">Limpeza</option>
                        <option value="Outros">Outros</option>
                      </select>
                   </div>
                 </div>
              </div>

              {/* Section: Endereço */}
              <div>
                 <h4 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-100 pb-2 mb-3">Endereço Completo</h4>
                 <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <input 
                         type="text" 
                         className="w-full border border-gray-300 rounded-lg p-2" 
                         value={newSupplier.zipCode || ''} 
                         onChange={handleZipChange}
                         placeholder="00000-000"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro (Rua/Av)</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.address || ''} onChange={e => setNewSupplier({...newSupplier, address: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                       <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.number || ''} onChange={e => setNewSupplier({...newSupplier, number: e.target.value})} />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                       <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.neighborhood || ''} onChange={e => setNewSupplier({...newSupplier, neighborhood: e.target.value})} />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                       <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                       <input required type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.city || ''} onChange={e => setNewSupplier({...newSupplier, city: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                       <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                       <input type="text" maxLength={2} className="w-full border border-gray-300 rounded-lg p-2 uppercase" value={newSupplier.state || ''} onChange={e => setNewSupplier({...newSupplier, state: e.target.value.toUpperCase()})} placeholder="SP" />
                    </div>
                 </div>
              </div>

              {/* Section: Contato */}
              <div>
                 <h4 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-100 pb-2 mb-3">Contato</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Nome Representante</label>
                       <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newSupplier.contactName || ''} onChange={e => setNewSupplier({...newSupplier, contactName: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Celular</label>
                       <input 
                          type="text" 
                          className="w-full border border-gray-300 rounded-lg p-2" 
                          value={newSupplier.contactPhone || ''} 
                          onChange={handlePhoneChange}
                          placeholder="(99) 99999-9999"
                       />
                       <p className="text-xs text-gray-400 mt-1">Opcional</p>
                    </div>
                 </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4 shadow-sm">
                Confirmar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Cadastrar Produto</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newProduct.code || ''} onChange={e => setNewProduct({...newProduct, code: e.target.value})} />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value as any})}>
                    <option value="CX">Caixa (CX)</option>
                    <option value="KG">Quilo (KG)</option>
                    <option value="UN">Unidade (UN)</option>
                    <option value="SC">Saco (SC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso Médio (kg)</label>
                  <input required type="number" step="0.1" className="w-full border border-gray-300 rounded-lg p-2" value={newProduct.weightPerUnit || ''} onChange={e => setNewProduct({...newProduct, weightPerUnit: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 mt-4">Cadastrar Produto</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;