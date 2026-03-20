/**
 * UserRepository - Gerencia persistência de usuários
 * Segue o mesmo padrão do CatRepository para fácil migração
 * Suporta injeção de dependência (database adapter)
 */

export class UserRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de UserRepository');
    }
    this.database = databaseAdapter;
  }

  /**
   * Busca todos os usuários
   * @returns {Array} Array de usuários
   */
  getAll() {
    return this.database.getAllUsers();
  }

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  findByEmail(email) {
    return this.database.findUserByEmail(email);
  }

  /**
   * Valida credenciais de um usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Object|null} Usuário se credenciais válidas, null caso contrário
   */
  validateCredentials(email, password) {
    const user = this.findByEmail(email);

    if (!user) {
      return null;
    }

    // Em produção: comparar com hash bcrypt
    // const isValidPassword = await bcrypt.compare(password, user.password);
    if (user.password === password) {
      // Retorna usuário sem expor a senha
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  /**
   * Verifica se um usuário é admin
   * @param {string} email - Email do usuário
   * @returns {boolean} true se é admin
   */
  isAdmin(email) {
    const user = this.findByEmail(email);
    return user && user.role === 'admin';
  }
}

export default UserRepository;
