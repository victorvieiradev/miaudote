/**
 * AuthService - Gerencia autenticação de administrador em memória
 * Implementa padrão Singleton para garantir uma única instância
 */
class AuthService {
  constructor() {
    this.adminCredentials = {
      email: 'admin@admin.com',
      password: 'admin'
    };
    this.isAuthenticated = false;
    this.currentEmail = null;
  }

  /**
   * Valida as credenciais fornecidas
   * @param {string} email - E-mail do administrador
   * @param {string} password - Senha do administrador
   * @returns {boolean} true se as credenciais são válidas, false caso contrário
   */
  validateCredentials(email, password) {
    return (
      email === this.adminCredentials.email &&
      password === this.adminCredentials.password
    );
  }

  /**
   * Realiza login com as credenciais fornecidas
   * @param {string} email - E-mail do administrador
   * @param {string} password - Senha do administrador
   * @returns {boolean} true se o login foi bem-sucedido, false caso contrário
   */
  login(email, password) {
    if (this.validateCredentials(email, password)) {
      this.isAuthenticated = true;
      this.currentEmail = email;
      return true;
    }
    return false;
  }

  /**
   * Realiza logout e limpa o estado de autenticação
   */
  logout() {
    this.isAuthenticated = false;
    this.currentEmail = null;
  }

  /**
   * Verifica se o administrador está autenticado
   * @returns {boolean} true se autenticado, false caso contrário
   */
  isAdmin() {
    return this.isAuthenticated;
  }

  /**
   * Gera header de autenticação Basic Auth
   * Formato: "Basic base64(email:password)"
   * @returns {string} header Authorization pronto para uso
   */
  getAuthHeader() {
    if (!this.isAuthenticated) {
      return null;
    }
    const credentials = `${this.adminCredentials.email}:${this.adminCredentials.password}`;
    // Usar btoa() para compatibilidade com navegador
    const encoded = typeof Buffer !== 'undefined'
      ? Buffer.from(credentials).toString('base64')
      : btoa(credentials);
    return `Basic ${encoded}`;
  }
}

// Singleton: retorna sempre a mesma instância
const authService = new AuthService();
export default authService;
