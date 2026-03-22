import React, { useEffect, useState } from 'react';

const SuperAdminDashboard = ({ apiBase, authService, onTenantCreated }) => {
  const [tenants, setTenants] = useState([]);
  const [newTenantName, setNewTenantName] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [message, setMessage] = useState(null);

  const fetchTenants = async () => {
    const response = await fetch(`${apiBase}/tenants`, {
      headers: { Authorization: authService.getAuthHeader() },
    });
    const data = await response.json();
    setTenants(data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateTenant = async () => {
    if (!newTenantName) return;

    const response = await fetch(`${apiBase}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authService.getAuthHeader(),
      },
      body: JSON.stringify({ name: newTenantName }),
    });

    if (!response.ok) {
      setMessage('Falha ao criar ONG');
      return;
    }

    setNewTenantName('');
    await fetchTenants();
    onTenantCreated();
    setMessage('ONG criada com sucesso!');
  };

  const handleCreateOrgAdmin = async () => {
    if (!selectedTenantId || !newAdminEmail || !newAdminPassword) {
      setMessage('Preencha todos os campos de administrador');
      return;
    }

    const response = await fetch(`${apiBase}/tenants/${selectedTenantId}/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authService.getAuthHeader(),
      },
      body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      setMessage(error.message || 'Falha ao criar administrador');
      return;
    }

    setNewAdminEmail('');
    setNewAdminPassword('');
    setMessage('Administrador da ONG criado com sucesso');
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Painel do Super Administrador</h2>

      {message && <div className="text-sm text-green-600">{message}</div>}

      <section className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold">Cadastrar ONG</h3>
        <div className="flex gap-2 mt-2">
          <input
            value={newTenantName}
            onChange={(e) => setNewTenantName(e.target.value)}
            placeholder="Nome da ONG"
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button onClick={handleCreateTenant} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Criar
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold">Cadastrar administrador da ONG</h3>
        <div className="flex flex-col gap-2 mt-2">
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Selecione uma ONG</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
            ))}
          </select>
          <input
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Email do admin"
            className="border px-3 py-2 rounded-lg"
          />
          <input
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            placeholder="Senha do admin"
            type="password"
            className="border px-3 py-2 rounded-lg"
          />
          <button onClick={handleCreateOrgAdmin} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Criar admin ONG
          </button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold">ONGs cadastradas</h3>
        <ul className="mt-2 space-y-1">
          {tenants.map((tenant) => (
            <li key={tenant.id} className="border p-2 rounded-lg flex justify-between items-center">
              <span>{tenant.name}</span>
              <small className="text-gray-500">{tenant.id}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
