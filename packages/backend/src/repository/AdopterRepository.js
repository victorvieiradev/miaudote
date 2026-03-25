/**
 * AdopterRepository - Gerencia persistência de adotantes
 * Suporta injeção de dependência (database adapter)
 */
import { Adopter } from '../entities/Adopter.js';

export class AdopterRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de AdopterRepository');
    }
    this.database = databaseAdapter;
  }

  getAll(tenantId = null) {
    // Por enquanto, armazenar em memória simples
    // TODO: Adicionar ao DatabaseAdapter
    if (!this.database.data.adopters) {
      this.database.data.adopters = [];
    }
    const adopters = this.database.data.adopters.map(a => new Adopter(a));
    if (tenantId) {
      return adopters.filter(a => a.tenant_id === tenantId);
    }
    return adopters;
  }

  findById(id, tenantId = null) {
    const adopter = this.getAll(tenantId).find(a => a.id === id);
    return adopter || null;
  }

  create(adopterData) {
    const newAdopter = new Adopter(adopterData);

    const adopters = this.getAll();
    adopters.push(newAdopter);

    // Salvar no database adapter
    this.database.data.adopters = adopters.map(a => ({ ...a }));

    return newAdopter;
  }

  update(id, updates, tenantId = null) {
    const adopter = this.findById(id, tenantId);
    if (!adopter) {
      throw new Error('Adotante não encontrado');
    }

    const updatedAdopter = new Adopter({
      ...adopter,
      ...updates,
      id: adopter.id,
      updatedAt: new Date().toISOString(),
    });

    const adopters = this.getAll(tenantId).map(a =>
      a.id === id ? updatedAdopter : a
    );
    this.database.data.adopters = adopters.map(a => ({ ...a }));

    return updatedAdopter;
  }

  delete(id, tenantId = null) {
    const adopter = this.findById(id, tenantId);
    if (!adopter) {
      throw new Error('Adotante não encontrado');
    }
    const adopters = this.getAll(tenantId).filter(a => a.id !== id);
    this.database.data.adopters = adopters.map(a => ({ ...a }));
    return true;
  }

  // Métodos específicos
  findByWhatsapp(whatsapp) {
    return this.getAll().find(a => a.whatsapp === whatsapp);
  }

  findPending() {
    return this.getAll().filter(a => a.isPending());
  }

  findApproved() {
    return this.getAll().filter(a => a.isApproved());
  }
}