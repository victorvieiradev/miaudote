import React from 'react';
import { X } from 'lucide-react';

const GenericModal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold">{title}</h3>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default GenericModal;