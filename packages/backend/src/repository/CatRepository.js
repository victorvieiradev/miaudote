import { Cat } from '../entities/Cat.js';

export class CatRepository {
  /**
   * Construtor com injeção de dependência
   * Permite trocar a fonte de dados (memória, BD, etc)
   * @param {DatabaseAdapter} databaseAdapter - Adapter de banco de dados
   */
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de CatRepository');
    }
    this.database = databaseAdapter;
  }

  /**
   * Retorna todos os gatos
   * @returns {Array<Cat>} Array de instâncias de Cat
   */
  getAll() {
    return this.database.getAllCats().map(c => new Cat(c));
  }

  /**
   * Salva gatos no database
   * @param {Array<Cat>} cats - Array de gatos para salvar
   * @returns {boolean} true se salvo com sucesso
   */
  save(cats) {
    return this.database.saveCats(cats);
  }
}