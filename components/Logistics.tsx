import React, { useState } from 'react';
import { Trip } from '../types';
import { Truck, MapPin, Package, Scale, Plus, X } from 'lucide-react';

interface LogisticsProps {
  trips: Trip[];
  onAddTrip: (trip: Trip) => void;
}

const Logistics: React.FC<LogisticsProps> = ({ trips, onAddTrip }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    date: new Date().toISOString().split('T')[0],
    invoices: []
  });

  const handleOpenModal = () => {
    // Gerar um código automático simples
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setNewTrip({
      code: `V-2023-${randomSuffix}`,
      date: new Date().toISOString().split('T')[0],
      invoices: [],
      freightCost: 0,
      totalWeight: 0
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.driver || !newTrip.licensePlate || !newTrip.transporter) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const trip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      code: newTrip.code || `V-${Date.now()}`,
      driver: newTrip.driver,
      licensePlate: newTrip.licensePlate,
      transporter: newTrip.transporter,
      date: newTrip.date || new Date().toISOString().split('T')[0],
      freightCost: Number(newTrip.freightCost) || 0,
      totalWeight: Number(newTrip.totalWeight) || 0,
      invoices: [] // Inicialmente sem notas
    };

    onAddTrip(trip);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Logística e Viagens</h2>
          <p className="text-gray-500">Rastreie fretes, cargas e transportadoras</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Nova Viagem
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{trip.code}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <MapPin size={14} /> {trip.transporter}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  R$ {trip.freightCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Custo do Frete</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">Motorista</span>
                <span className="font-medium text-gray-800">{trip.driver}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">Placa</span>
                <span className="font-medium text-gray-800">{trip.licensePlate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">Data</span>
                <span className="font-medium text-gray-800">{new Date(trip.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">Peso Total</span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  <Scale size={14} /> {(trip.totalWeight / 1000).toFixed(1)} tons
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package size={16} /> Notas Fiscais Vinculadas (Carga)
              </h4>
              <div className="flex gap-2">
                {trip.invoices.length > 0 ? (
                   trip.invoices.map((inv) => (
                    <span key={inv} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
                      NF #{inv}
                    </span>
                   ))
                ) : (
                  <span className="text-xs text-gray-400 italic">Nenhuma nota vinculada</span>
                )}
              </div>
            </div>
            
            {/* Simulation of Freight Apportionment */}
            {trip.totalWeight > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-400 italic">
                   Custo de frete por kg: R$ {(trip.freightCost / trip.totalWeight).toFixed(4)}
                 </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL DE NOVA VIAGEM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Cadastrar Nova Viagem</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código (Auto)</label>
                    <input disabled type="text" className="w-full border border-gray-300 bg-gray-100 rounded-lg p-2" value={newTrip.code || ''} />
                 </div>
                 <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newTrip.date || ''} 
                      onChange={e => setNewTrip({...newTrip, date: e.target.value})}
                      required
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transportadora</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                  value={newTrip.transporter || ''} 
                  onChange={e => setNewTrip({...newTrip, transporter: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motorista</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newTrip.driver || ''} 
                      onChange={e => setNewTrip({...newTrip, driver: e.target.value})}
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newTrip.licensePlate || ''} 
                      onChange={e => setNewTrip({...newTrip, licensePlate: e.target.value})}
                      required
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custo Frete</label>
                    <div className="relative">
                       <span className="absolute left-3 top-2 text-gray-500">R$</span>
                       <input 
                        type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-2 pl-9" 
                        value={newTrip.freightCost || ''} 
                        onChange={e => setNewTrip({...newTrip, freightCost: Number(e.target.value)})}
                        required
                      />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso Total (kg)</label>
                    <input 
                      type="number" step="1" 
                      className="w-full border border-gray-300 rounded-lg p-2" 
                      value={newTrip.totalWeight || ''} 
                      onChange={e => setNewTrip({...newTrip, totalWeight: Number(e.target.value)})}
                    />
                 </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4">
                Salvar Viagem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;