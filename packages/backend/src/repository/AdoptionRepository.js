/**
 * AdoptionRepository - Gerencia persistência de adoções
 * Suporta injeção de dependência (database adapter)
 */
import { Adoption } from '../entities/Adoption.js';

export class AdoptionRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de AdoptionRepository');
    }
    this.database = databaseAdapter;
  }

  getAll(tenantId = null) {
    return this.database.getAllAdoptions(tenantId);
  }

  findById(id, tenantId = null) {
    const adoption = this.database.getAllAdoptions(tenantId).find(a => a.id === id);
    return adoption ? new Adoption(adoption) : null;
  }

  findByCatId(catId, tenantId = null) {
    return this.database.getAllAdoptions(tenantId)
      .filter(a => a.cat_id === catId)
      .map(a => new Adoption(a));
  }

  findByAdopterId(adopterId, tenantId = null) {
    return this.database.getAllAdoptions(tenantId)
      .filter(a => a.adopter_id === adopterId)
      .map(a => new Adoption(a));
  }

  findPending(tenantId = null) {
    return this.database.getAllAdoptions(tenantId)
      .filter(a => a.status === 'pending')
      .map(a => new Adoption(a));
  }

  create({ cat_id, adopter_id, notes = '' }, tenantId = null) {
    const newAdoption = new Adoption({
      cat_id,
      adopter_id,
      notes,
    });

    const adoptions = this.database.getAllAdoptions(tenantId);
    adoptions.push(newAdoption);
    this.database.saveAdoptions(adoptions);

    return newAdoption;
  }

  update(id, updates, tenantId = null) {
    const adoption = this.findById(id, tenantId);
    if (!adoption) {
      throw new Error('Adoção não encontrada');
    }

    const updatedAdoption = new Adoption({
      ...adoption,
      ...updates,
      id: adoption.id,
      updatedAt: new Date().toISOString(),
    });

    const adoptions = this.database.getAllAdoptions(tenantId).map(a =>
      a.id === id ? updatedAdoption : a
    );
    this.database.saveAdoptions(adoptions);

    return updatedAdoption;
  }

  approve(id, notes = '', tenantId = null) {
    const adoption = this.findById(id, tenantId);
    if (!adoption) {
      throw new Error('Adoção não encontrada');
    }

    adoption.approve(notes);

    const adoptions = this.database.getAllAdoptions(tenantId).map(a =>
      a.id === id ? adoption : a
    );
    this.database.saveAdoptions(adoptions);

    return adoption;
  }

  reject(id, reason = '', tenantId = null) {
    const adoption = this.findById(id, tenantId);
    if (!adoption) {
      throw new Error('Adoção não encontrada');
    }

    adoption.reject(reason);

    const adoptions = this.database.getAllAdoptions(tenantId).map(a =>
      a.id === id ? adoption : a
    );
    this.database.saveAdoptions(adoptions);

    return adoption;
  }

  complete(id, tenantId = null) {
    const adoption = this.findById(id, tenantId);
    if (!adoption) {
      throw new Error('Adoção não encontrada');
    }

    adoption.complete();

    const adoptions = this.database.getAllAdoptions(tenantId).map(a =>
      a.id === id ? adoption : a
    );
    this.database.saveAdoptions(adoptions);

    return adoption;
  }

  delete(id, tenantId = null) {
    const adoptions = this.database.getAllAdoptions(tenantId).filter(a => a.id !== id);
    this.database.saveAdoptions(adoptions);
    return true;
  }
}