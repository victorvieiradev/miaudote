import React, { useState } from 'react';

const CatForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    photo: initialData?.photo || "",
    description: initialData?.description || "",

    // Identificação Básica
    estimatedAge: initialData?.estimatedAge || "Filhote",
    sex: initialData?.sex || "Macho",
    breed: initialData?.breed || "SRD",
    coat: initialData?.coat || "",
    microchip: initialData?.microchip || "",

    // Dados do Resgate
    rescuedAt: initialData?.rescuedAt || "",
    rescueLocation: initialData?.rescueLocation || "",
    origin: initialData?.origin || "Abandono",
    rescuer: initialData?.rescuer || "",

    // Saúde e Clínica
    initialWeight: initialData?.initialWeight || "",
    bodyCondition: initialData?.bodyCondition || "Peso Ideal",
    spayedNeutered: initialData?.spayedNeutered ?? false,
    vaccination: initialData?.vaccination || [],
    fivFelv: initialData?.fivFelv || "Não testado",
    deworming: initialData?.deworming || "",

    // Perfil Comportamental
    temperament: initialData?.temperament || [],
    sociability: initialData?.sociability || [],
    habits: initialData?.habits || "",
  });

  const toggleArrayValue = (key, value) => {
    setForm((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
    >
      {/* Seção 1: Identificação Básica */}
      <div className="space-y-2">
        <h3 className="font-bold">Identificação Básica</h3>
        <input
          required
          placeholder="Nome do Gato"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="URL da Foto"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.photo}
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={form.estimatedAge}
            onChange={(e) => setForm({ ...form, estimatedAge: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg"
          >
            <option>Filhote</option>
            <option>Jovem</option>
            <option>Adulto</option>
            <option>Idoso</option>
          </select>
          <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sex"
                value="Macho"
                checked={form.sex === "Macho"}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
              />
              Macho
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sex"
                value="Fêmea"
                checked={form.sex === "Fêmea"}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
              />
              Fêmea
            </label>
          </div>
        </div>
        <input
          placeholder="Raça"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
        />
        <input
          placeholder="Pelagem / Cor"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.coat}
          onChange={(e) => setForm({ ...form, coat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Microchip / RGA"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.microchip}
          onChange={(e) => setForm({ ...form, microchip: e.target.value })}
        />
      </div>

      {/* Seção 2: Dados do Resgate */}
      <div className="space-y-2">
        <h3 className="font-bold">Dados do Resgate</h3>
        <input
          type="datetime-local"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.rescuedAt}
          onChange={(e) => setForm({ ...form, rescuedAt: e.target.value })}
        />
        <input
          placeholder="Local do Resgate"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.rescueLocation}
          onChange={(e) => setForm({ ...form, rescueLocation: e.target.value })}
        />
        <select
          value={form.origin}
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
          className="w-full p-3 bg-gray-100 rounded-lg"
        >
          <option>Abandono</option>
          <option>Maus-tratos</option>
          <option>Colônia</option>
          <option>Devolução de Adoção</option>
        </select>
        <input
          placeholder="Dados do Resgatador"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.rescuer}
          onChange={(e) => setForm({ ...form, rescuer: e.target.value })}
        />
      </div>

      {/* Seção 3: Saúde e Clínica */}
      <div className="space-y-2">
        <h3 className="font-bold">Saúde e Clínica</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            type="number"
            step="0.1"
            placeholder="Peso Inicial (kg)"
            className="w-full p-3 bg-gray-100 rounded-lg"
            value={form.initialWeight}
            onChange={(e) => setForm({ ...form, initialWeight: e.target.value })}
          />
          <select
            value={form.bodyCondition}
            onChange={(e) => setForm({ ...form, bodyCondition: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg"
          >
            <option>Desnutrido</option>
            <option>Peso Ideal</option>
            <option>Obeso</option>
          </select>
        </div>
        <label className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
          <input
            type="checkbox"
            checked={form.spayedNeutered}
            onChange={(e) => setForm({ ...form, spayedNeutered: e.target.checked })}
          />
          Castração realizada
        </label>
        <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
          <span className="font-medium">Protocolo de Vacinação</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vaccination.includes("V4")}
              onChange={() => toggleArrayValue("vaccination", "V4")}
            />
            V4
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vaccination.includes("V5")}
              onChange={() => toggleArrayValue("vaccination", "V5")}
            />
            V5
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vaccination.includes("Raiva")}
              onChange={() => toggleArrayValue("vaccination", "Raiva")}
            />
            Raiva
          </label>
        </div>
        <select
          value={form.fivFelv}
          onChange={(e) => setForm({ ...form, fivFelv: e.target.value })}
          className="w-full p-3 bg-gray-100 rounded-lg"
        >
          <option>Não testado</option>
          <option>Negativo/Negativo</option>
          <option>Positivo FIV</option>
          <option>Positivo FeLV</option>
          <option>Duplo Positivo</option>
        </select>
        <input
          placeholder="Vermifugação / Ectoparasitas"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.deworming}
          onChange={(e) => setForm({ ...form, deworming: e.target.value })}
        />
      </div>

      {/* Seção 4: Perfil Comportamental */}
      <div className="space-y-2">
        <h3 className="font-bold">Perfil Comportamental</h3>
        <div className="space-y-1 p-3 bg-gray-100 rounded-lg">
          <span className="font-medium">Temperamento</span>
          <div className="flex flex-wrap gap-2">
            {['Dócil', 'Arredio', 'Medroso', 'Carente'].map((option) => (
              <button
                key={option}
                type="button"
                className={`px-3 py-1 rounded-full border ${
                  form.temperament.includes(option)
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
                onClick={() => toggleArrayValue('temperament', option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
          <span className="font-medium">Sociabilidade</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sociability.includes('Convive com gatos')}
              onChange={() => toggleArrayValue('sociability', 'Convive com gatos')}
            />
            Convive com gatos
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sociability.includes('Convive com cães')}
              onChange={() => toggleArrayValue('sociability', 'Convive com cães')}
            />
            Convive com cães
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sociability.includes('Apto para crianças')}
              onChange={() => toggleArrayValue('sociability', 'Apto para crianças')}
            />
            Apto para crianças
          </label>
        </div>
        <textarea
          placeholder="Hábitos (uso de caixa de areia, nível de atividade...)"
          className="w-full p-3 bg-gray-100 rounded-lg"
          value={form.habits}
          onChange={(e) => setForm({ ...form, habits: e.target.value })}
        />
      </div>

      <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">
        Salvar
      </button>
    </form>
  );
};

export default CatForm;