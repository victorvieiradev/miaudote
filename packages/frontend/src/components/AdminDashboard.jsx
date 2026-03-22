import React from 'react';
import { CheckCircle, Edit3, Trash2, FileText } from 'lucide-react';

const AdminDashboard = ({ cats, onEdit, onDelete, onMarkAdopted, onAdd, onViewDetails }) => (
  <div className="p-4 space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="font-bold text-xl">Gestão</h2>
      <button
        onClick={onAdd}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        + Novo
      </button>
    </div>
    {cats.map((cat) => (
      <div
        key={cat.id}
        className="bg-white p-4 rounded-xl border flex items-center gap-4"
      >
        <img src={cat.photo} className="w-12 h-12 rounded-lg object-cover" />
        <div className="flex-1 font-bold">{cat.name}</div>
        <div className="flex gap-2">
          {cat.status === "available" && (
            <button
              onClick={() => onMarkAdopted({ cat })}
              className="text-green-600"
              aria-label="Marcar gato como adotado"
            >
              <CheckCircle size={20} />
              <span className="sr-only">Marcar gato como adotado</span>
            </button>
          )}
          <button onClick={() => onViewDetails(cat)} className="text-gray-600" aria-label="Visualizar ficha do gato">
            <FileText size={20} />
            <span className="sr-only">Visualizar ficha do gato</span>
          </button>
          <button onClick={() => onEdit(cat)} className="text-blue-600" aria-label="Editar gato">
            <Edit3 size={20} />
            <span className="sr-only">Editar gato</span>
          </button>
          <button onClick={() => onDelete(cat.id)} className="text-red-600" aria-label="Deletar gato">
            <Trash2 size={20} />
            <span className="sr-only">Deletar gato</span>
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default AdminDashboard;