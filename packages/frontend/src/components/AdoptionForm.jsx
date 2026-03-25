import React, { useState } from 'react';

const AdoptionForm = ({ catName, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    homeType: "",
    hasOtherPets: false,
    otherPetsDetails: "",
    familyComposition: "",
    hasChildren: false,
    childrenAges: "",
    workSchedule: "",
    adoptionReason: "",
    previousExperience: "",
  });

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
      <input
        placeholder="Email"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Endereço"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <input
        placeholder="Tipo de moradia (casa, apartamento, etc)"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, homeType: e.target.value })}
      />
      <div className="flex items-center gap-3">
        <label className="text-sm">Possui outros pets?</label>
        <input
          type="checkbox"
          checked={form.hasOtherPets}
          onChange={(e) => setForm({ ...form, hasOtherPets: e.target.checked })}
        />
      </div>
      <input
        placeholder="Detalhes dos outros pets"
        className="w-full p-3 bg-gray-100 rounded-lg"
        value={form.otherPetsDetails}
        onChange={(e) => setForm({ ...form, otherPetsDetails: e.target.value })}
      />
      <input
        placeholder="Composição familiar"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, familyComposition: e.target.value })}
      />
      <div className="flex items-center gap-3">
        <label className="text-sm">Possui filhos?</label>
        <input
          type="checkbox"
          checked={form.hasChildren}
          onChange={(e) => setForm({ ...form, hasChildren: e.target.checked })}
        />
      </div>
      <input
        placeholder="Idades dos filhos"
        className="w-full p-3 bg-gray-100 rounded-lg"
        value={form.childrenAges}
        onChange={(e) => setForm({ ...form, childrenAges: e.target.value })}
      />
      <input
        placeholder="Horário de trabalho"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, workSchedule: e.target.value })}
      />
      <input
        placeholder="Motivo da adoção"
        className="w-full p-3 bg-gray-100 rounded-lg"
        onChange={(e) => setForm({ ...form, adoptionReason: e.target.value })}
      />
      <textarea
        placeholder="Experiência anterior com pets"
        className="w-full p-3 bg-gray-100 rounded-lg"
        value={form.previousExperience}
        onChange={(e) => setForm({ ...form, previousExperience: e.target.value })}
      />
      <button className="w-full bg-black text-white py-3 rounded-lg font-bold">
        Enviar
      </button>
    </form>
  );
};

export default AdoptionForm;