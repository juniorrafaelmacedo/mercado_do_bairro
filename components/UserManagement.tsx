
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Trash2, Shield, User as UserIcon, CheckSquare, Square, Pencil, X } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    roles: [] as UserRole[]
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password || formData.roles.length === 0) {
      alert("Preencha todos os campos e selecione pelo menos uma permissão.");
      return;
    }

    if (editingId) {
      // Atualizar usuário existente
      onUpdateUser({
        id: editingId,
        ...formData
      });
      setEditingId(null);
    } else {
      // Criar novo usuário
      onAddUser({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      });
    }

    // Resetar formulário
    setFormData({
      name: '',
      username: '',
      password: '',
      roles: []
    });
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '', // Carregar senha existente (mock)
      roles: user.roles
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      roles: []
    });
  };

  const toggleRole = (role: UserRole) => {
    setFormData(prev => {
      if (prev.roles.includes(role)) {
        return { ...prev, roles: prev.roles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...prev.roles, role] };
      }
    });
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return 'Administrador';
      case UserRole.FINANCE: return 'Financeiro';
      case UserRole.PURCHASING: return 'Compras';
      case UserRole.LOGISTICS: return 'Logística';
      default: return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return 'bg-purple-100 text-purple-700';
      case UserRole.FINANCE: return 'bg-yellow-100 text-yellow-700';
      case UserRole.PURCHASING: return 'bg-blue-100 text-blue-700';
      case UserRole.LOGISTICS: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const availableRoles = [
    { id: UserRole.ADMIN, label: 'Admin (Mestre)' },
    { id: UserRole.FINANCE, label: 'Financeiro' },
    { id: UserRole.PURCHASING, label: 'Compras' },
    { id: UserRole.LOGISTICS, label: 'Logística' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <UserPlus size={20} className={editingId ? "text-blue-600" : "text-green-600"} />
            {editingId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
          </h3>
          {editingId && (
            <button 
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
            >
              <X size={16} /> Cancelar Edição
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário (Login)</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: jsilva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="text" // Mantendo como text para facilitar a visualização no mock, em prod seria password
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Ex: 123"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissões de Acesso</label>
            <div className="flex flex-wrap gap-3">
              {availableRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.roles.includes(role.id)
                      ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {formData.roles.includes(role.id) ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                  {role.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              * Administrador tem acesso total independente de outras seleções.
            </p>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className={`${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-2 rounded-lg transition font-medium w-full md:w-auto`}
            >
              {editingId ? 'Salvar Alterações' : 'Adicionar Usuário'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Shield size={20} className="text-blue-600" />
            Usuários do Sistema
          </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Usuário</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Login</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Perfis</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <UserIcon size={16} />
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <span key={role} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                        {getRoleLabel(role)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition"
                        title="Editar Usuário"
                      >
                        <Pencil size={18} />
                      </button>
                    {!user.roles.includes(UserRole.ADMIN) && (
                      <button 
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
                        title="Remover Usuário"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
