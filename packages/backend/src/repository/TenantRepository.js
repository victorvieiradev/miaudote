export class TenantRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de TenantRepository');
    }
    this.database = databaseAdapter;
  }

  getAll() {
    return this.database.getAllTenants();
  }

  findById(tenantId) {
    return this.database.findTenantById(tenantId);
  }

  create({ name }) {
    if (!name) {
      throw new Error('Nome da ONG é obrigatório');
    }

    const id = `tenant-${Date.now()}`;
    const newTenant = {
      id,
      name,
      createdAt: new Date().toISOString(),
    };

    const tenants = this.database.getAllTenants();
    tenants.push(newTenant);
    this.database.saveTenants(tenants);

    return newTenant;
  }
}

export default TenantRepository;
