/**
 * DatabaseAdapter - Abstração para diferentes fontes de dados
 * Atualmente suporta: 'memory' (JSON em memória)
 * Futuro: PostgreSQL, MongoDB, etc
 */

export class DatabaseAdapter {
  constructor(type = 'memory') {
    this.type = type;
    this.data = {
      users: this.getUsersSeedData(),
      cats: this.getCatsSeedData(),
    };
  }

  /**
   * Dados seed de usuários admin
   * @returns {Array} Array de usuários
   */
  getUsersSeedData() {
    return [
      {
        id: '1',
        email: 'admin@admin.com',
        password: 'admin', // Em produção: hash bcrypt
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Dados seed de gatos (mantém compatibilidade)
   * @returns {Array} Array de gatos
   */
  getCatsSeedData() {
    return [
      {
        id: '1',
        name: 'Mingau',
        photo:
          'https://images.unsplash.com/photo-1595433707802-68267d83760a?w=800',
        description: 'Um mestre em ronronar e pedir sachê.',
        status: 'available',
      },
      {
        id: '2',
        name: 'Luna',
        photo:
          'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800',
        description: 'Calma, elegante e adora janelas ensolaradas.',
        status: 'available',
      },
      {
        id: '3',
        name: 'Simba',
        photo:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
        description: 'O rei da sala de estar procura sua rainha.',
        status: 'available',
      },
    ];
  }

  /**
   * Busca todos os usuários
   * @returns {Array} Array de usuários
   */
  getAllUsers() {
    return this.data.users;
  }

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   * @returns {Object|null} Usuário encontrado ou null
   */
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email === email) || null;
  }

  /**
   * Busca todos os gatos
   * @returns {Array} Array de gatos
   */
  getAllCats() {
    return this.data.cats;
  }

  /**
   * Salva gatos
   * @param {Array} cats - Array de gatos
   * @returns {boolean} true se salvo com sucesso
   */
  saveCats(cats) {
    this.data.cats = cats;
    return true;
  }
}

// Singleton: instância única do adapter
const databaseAdapter = new DatabaseAdapter('memory');
export default databaseAdapter;
