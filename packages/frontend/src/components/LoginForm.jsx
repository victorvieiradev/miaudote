import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import authService from '../services/AuthService';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula delay de processamento
    setTimeout(() => {
      if (authService.login(email, password)) {
        onLoginSuccess();
      } else {
        // Mensagem de erro genérica para não revelar qual campo está incorreto
        setError('Email ou senha inválidos. Tente novamente.');
        setPassword(''); // Limpa o campo de senha
      }
      setIsLoading(false);
    }, 500);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Limpa erro ao começar a digitar
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Limpa erro ao começar a digitar
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Só Gatinhos
          </span>
          <p className="text-gray-600 mt-2">Administrador</p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-5"
        >
          <h2 className="text-xl font-bold text-center text-gray-800">
            Acesso Administrativo
          </h2>

          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="admin@admin.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition pr-12"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {isLoading ? 'Autenticando...' : 'Login'}
          </button>
        </form>

        {/* Rodapé informativo */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Área restrita para administradores da ONG
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
