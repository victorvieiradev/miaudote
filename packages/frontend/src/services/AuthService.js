/**
 * AuthService - Gerencia autenticação de administrador em memória
 * Implementa padrão Singleton para garantir uma única instância
 */
class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authHeader = null;
    this.API_BASE = 'http://localhost:3001';
  }

  getAuthHeader() {
    return this.authHeader;
  }

  async login(email, password) {
    const response = await fetch(`${this.API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    this.isAuthenticated = true;
    this.currentUser = data.user;

    const encoded = typeof Buffer !== 'undefined'
      ? Buffer.from(`${email}:${password}`).toString('base64')
      : btoa(`${email}:${password}`);

    this.authHeader = `Basic ${encoded}`;
    return true;
  }

  /**
   * Realiza logout e limpa o estado de autenticação
   */
  logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authHeader = null;
  }

  /**
   * Verifica se o administrador está autenticado
   * @returns {boolean} true se autenticado, false caso contrário
   */
  isAdmin() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.currentUser;
  }
}

// Singleton: retorna sempre a mesma instância
const authService = new AuthService();
export default authService;
