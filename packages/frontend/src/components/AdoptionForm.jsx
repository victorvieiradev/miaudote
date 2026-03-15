import React, { useState } from 'react';

const AdoptionForm = ({ catName, onSubmit }) => {
  const [form, setForm] = useState({ name: "", whatsapp: "" });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <input
        required
        placeholder="Nome"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        required
        placeholder="WhatsApp"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
      />
      <button className="w-full bg-black text-white py-3 rounded-lg font-bold">
        Enviar
      </button>
    </form>
  );
};

export default AdoptionForm;