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
   * Retorna todos os gatos por tenant
   * @param {string|null} tenantId - Tenant ID
   * @returns {Array<Cat>} Array de instâncias de Cat
   */
  getAll(tenantId = null) {
    return this.database.getAllCats(tenantId).map(c => new Cat(c));
  }

  findById(catId, tenantId = null) {
    const catData = this.database.findCatById(catId, tenantId);
    return catData ? new Cat(catData) : null;
  }

  save(cats) {
    return this.database.saveCats(cats);
  }

  create(catData, tenantId) {
    if (!tenantId) {
      throw new Error('tenantId é obrigatório para criar um gato');
    }

    const id = `cat-${Date.now()}`;
    const newCat = new Cat({ ...catData, id, tenant_id: tenantId, status: catData.status || 'available', createdAt: new Date().toISOString() });
    const cats = this.database.getAllCats();
    cats.unshift(newCat);
    this.save(cats);
    return newCat;
  }
}