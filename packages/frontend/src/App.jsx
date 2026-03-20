import React, { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  User,
  MessageSquare,
  Instagram,
  Settings,
  X,
  Camera,
  ArrowLeft,
  LayoutGrid,
  Send,
  ExternalLink,
  LogOut,
} from "lucide-react";
import InstagramPost from './components/InstagramPost';
import AdminDashboard from './components/AdminDashboard';
import GenericModal from './components/GenericModal';
import CatForm from './components/CatForm';
import AdoptionForm from './components/AdoptionForm';
import LoginForm from './components/LoginForm';
import authService from './services/AuthService';

const API_BASE = 'http://localhost:3001';

const App = () => {
  const [view, setView] = useState("feed");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [intentModal, setIntentModal] = useState(null);
  const [adoptionRecordModal, setAdoptionRecordModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [catDetailsModal, setCatDetailsModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAdmin());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch(`${API_BASE}/cats`);
    const data = await response.json();
    setCats(data);
    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setView(view === "feed" ? "admin" : "feed");
    } else {
      setView("login");
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView("admin");
    showToast("Bem-vindo, administrador!");
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setView("feed");
    showToast("Logout realizado.");
  };

  /**
   * Faz uma requisição fetch com header de autenticação
   * @param {string} url - URL do endpoint
   * @param {Object} options - Opções do fetch (method, body, etc)
   * @returns {Promise<Response>}
   */
  const authenticatedFetch = async (url, options = {}) => {
    const authHeader = authService.getAuthHeader();
    console.log('Auth header gerado:', authHeader);

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authHeader) {
      headers.Authorization = authHeader;
    }

    console.log('Headers finais:', headers);
    console.log('Fazendo requisição para:', url);

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const handleCreateOrUpdate = async (formData) => {
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${API_BASE}/cats/${formData.id}` : `${API_BASE}/cats`;

    console.log('Tentando salvar gato:', formData);
    console.log('URL:', url);
    console.log('Método:', method);

    try {
      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      console.log('Resposta recebida:', response);
      console.log('Status:', response.status);

      if (response.status === 401) {
        setIsAuthenticated(false);
        setView("login");
        showToast("Sessão expirada. Faça login novamente.");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const updatedCat = await response.json();
      console.log('Gato salvo com sucesso:', updatedCat);

      let newCats;
      if (formData.id) {
        newCats = cats.map((c) => (c.id === formData.id ? updatedCat : c));
      } else {
        newCats = [updatedCat, ...cats];
      }
      setCats(newCats);
      showToast("Catálogo atualizado!");
    } catch (error) {
      console.error('Erro completo ao salvar gato:', error);
      showToast("Falha ao salvar (verifique o servidor)");
    } finally {
      setEditModal(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/cats/${id}`, { 
        method: 'DELETE' 
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setView("login");
        showToast("Sessão expirada. Faça login novamente.");
        return;
      }

      const newCats = cats.filter((c) => c.id !== id);
      setCats(newCats);
      showToast("Registro removido.");
    } catch (error) {
      console.error(error);
      showToast("Falha ao remover registro.");
    }
  };

  const handleFinalizeAdoption = async (catId, adopterData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/cats/${catId}/adopt`, {
        method: 'PUT',
        body: JSON.stringify(adopterData),
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setView("login");
        showToast("Sessão expirada. Faça login novamente.");
        return;
      }

      const updatedCat = await response.json();
      const newCats = cats.map((c) => (c.id === catId ? updatedCat : c));
      setCats(newCats);
      setAdoptionRecordModal(null);
      showToast("Adoção realizada! ❤️");
    } catch (error) {
      console.error(error);
      showToast("Falha ao finalizar adoção.");
    }
  };

  const publicFeed = useMemo(
    () => cats.filter((c) => c.status === "available"),
    [cats]
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-orange-500">
        Carregando...
      </div>
    );

  // Mostrar tela de login
  if (view === "login") {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <header className="w-full max-w-xl bg-white border-b border-gray-200 sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
          Só Gatinhos
        </span>
        <div className="flex items-center gap-2">
          {view === "admin" && isAuthenticated && (
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-full text-red-600 transition"
              title="Sair da administração"
            >
              <LogOut size={22} />
            </button>
          )}
          <button
            onClick={handleAdminAccess}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {view === "feed" ? <Settings size={22} /> : <LayoutGrid size={22} />}
          </button>
        </div>
      </header>

      <main className="w-full max-w-xl flex-1 pb-20">
        {view === "feed" ? (
          <div className="space-y-4 p-4">
            {publicFeed.map((cat) => (
              <InstagramPost
                key={cat.id}
                cat={cat}
                onAdopt={() => setIntentModal({ cat })}
              />
            ))}
          </div>
        ) : (
          <AdminDashboard
            cats={cats}
            onEdit={setEditModal}
            onDelete={handleDelete}
            onMarkAdopted={setAdoptionRecordModal}
            onAdd={() => setEditModal({})}
            onViewDetails={setCatDetailsModal}
          />
        )}
      </main>

      {/* Modais condensados para brevidade */}
      {editModal && (
        <GenericModal onClose={() => setEditModal(null)} title="Cadastro">
          <CatForm initialData={editModal} onSubmit={handleCreateOrUpdate} />
        </GenericModal>
      )}
      {adoptionRecordModal && (
        <GenericModal
          onClose={() => setAdoptionRecordModal(null)}
          title="Adotante"
        >
          <AdoptionForm
            catName={adoptionRecordModal.cat.name}
            onSubmit={(d) =>
              handleFinalizeAdoption(adoptionRecordModal.cat.id, d)
            }
          />
        </GenericModal>
      )}
      {intentModal && (
        <GenericModal onClose={() => setIntentModal(null)} title="Quero Adotar">
          <AdoptionForm
            catName={intentModal.cat.name}
            onSubmit={() => {
              setIntentModal(null);
              showToast("Interesse enviado!");
            }}
          />
        </GenericModal>
      )}
      {catDetailsModal && (
        <GenericModal onClose={() => setCatDetailsModal(null)} title="Ficha Cadastral">
          <div className="space-y-4">
            <img
              src={catDetailsModal.photo}
              alt={catDetailsModal.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <div className="space-y-2">
              <h4 className="font-bold text-lg">{catDetailsModal.name}</h4>
              <p className="text-gray-600">{catDetailsModal.description}</p>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold">Identificação Básica</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Idade:</span> {catDetailsModal.estimatedAge || '-'}
                </div>
                <div>
                  <span className="font-semibold">Sexo:</span> {catDetailsModal.sex || '-'}
                </div>
                <div>
                  <span className="font-semibold">Raça:</span> {catDetailsModal.breed || '-'}
                </div>
                <div>
                  <span className="font-semibold">Pelagem/Cor:</span> {catDetailsModal.coat || '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Microchip/RGA:</span> {catDetailsModal.microchip || '-'}
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold">Dados do Resgate</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Data e Hora:</span>{' '}
                  {catDetailsModal.rescuedAt
                    ? new Date(catDetailsModal.rescuedAt).toLocaleString()
                    : '-'}
                </div>
                <div>
                  <span className="font-semibold">Origem:</span> {catDetailsModal.origin || '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Local do Resgate:</span> {catDetailsModal.rescueLocation || '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Resgatador:</span> {catDetailsModal.rescuer || '-'}
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold">Saúde e Clínica</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Peso Inicial:</span>{' '}
                  {catDetailsModal.initialWeight || '-'} kg
                </div>
                <div>
                  <span className="font-semibold">Condição Corporal:</span> {catDetailsModal.bodyCondition || '-'}
                </div>
                <div>
                  <span className="font-semibold">Castração:</span>{' '}
                  {catDetailsModal.spayedNeutered ? 'Sim' : 'Não'}
                </div>
                <div>
                  <span className="font-semibold">FIV/FeLV:</span> {catDetailsModal.fivFelv || '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Vermifugação / Ectoparasitas:</span>{' '}
                  {catDetailsModal.deworming || '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Vacinação:</span>{' '}
                  {(catDetailsModal.vaccination || []).length > 0
                    ? (catDetailsModal.vaccination || []).join(', ')
                    : '-'}
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold">Perfil Comportamental</h5>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">Temperamento:</span>{' '}
                  {(catDetailsModal.temperament || []).length > 0
                    ? (catDetailsModal.temperament || []).join(', ')
                    : '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Sociabilidade:</span>{' '}
                  {(catDetailsModal.sociability || []).length > 0
                    ? (catDetailsModal.sociability || []).join(', ')
                    : '-'}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold">Hábitos:</span> {catDetailsModal.habits || '-'}
                </div>
              </div>
            </div>

            <div>
              <span className="font-semibold">Status:</span>{' '}
              {catDetailsModal.status === "available" ? "Disponível" : "Adotado"}
            </div>
            {catDetailsModal.adopter && (
              <div>
                <span className="font-semibold">Adotante:</span> {catDetailsModal.adopter.name} ({catDetailsModal.adopter.whatsapp})
              </div>
            )}
          </div>
        </GenericModal>
      )}

      {toast && (
        <div className="fixed bottom-10 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default App;