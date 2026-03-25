/**
 * TenantRepository - Gerencia persistência de tenants (ONGs)
 * Suporta injeção de dependência (database adapter)
 */
import { Tenant } from '../entities/Tenant.js';

export class TenantRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de TenantRepository');
    }
    this.database = databaseAdapter;
  }

  getAll() {
    return this.database.getAllTenants().map(t => new Tenant(t));
  }

  findById(tenantId) {
    const tenant = this.database.findTenantById(tenantId);
    return tenant ? new Tenant(tenant) : null;
  }

  create({ name, ...otherData }) {
    if (!name) {
      throw new Error('Nome da ONG é obrigatório');
    }

    // Verificar se nome já existe
    const existing = this.getAll().find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      throw new Error('Já existe uma ONG com este nome');
    }

    const newTenant = new Tenant({
      name,
      ...otherData,
    });

    const tenants = this.database.getAllTenants();
    tenants.push(newTenant);
    this.database.saveTenants(tenants);

    return newTenant;
  }

  update(id, updates) {
    const tenant = this.findById(id);
    if (!tenant) {
      throw new Error('ONG não encontrada');
    }

    const updatedTenant = new Tenant({
      ...tenant,
      ...updates,
      id: tenant.id,
      updatedAt: new Date().toISOString(),
    });

    const tenants = this.database.getAllTenants().map(t =>
      t.id === id ? updatedTenant : t
    );
    this.database.saveTenants(tenants);

    return updatedTenant;
  }

  delete(id) {
    // Verificar se há usuários ou gatos associados
    const users = this.database.getAllUsers().filter(u => u.tenant_id === id);
    const cats = this.database.getAllCats().filter(c => c.tenant_id === id);

    if (users.length > 0 || cats.length > 0) {
      throw new Error('Não é possível excluir ONG com usuários ou gatos associados');
    }

    const tenants = this.database.getAllTenants().filter(t => t.id !== id);
    this.database.saveTenants(tenants);
    return true;
  }

  // Método para verificar se tenant pode ser usado
  canUseTenant(tenantId) {
    const tenant = this.findById(tenantId);
    return tenant && tenant.isActive();
  }
}

export default TenantRepository;
