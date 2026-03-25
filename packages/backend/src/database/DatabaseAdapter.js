import bcrypt from 'bcryptjs';

/**
 * DatabaseAdapter - Abstração para diferentes fontes de dados
 * Atualmente suporta: 'memory' (JSON em memória)
 * Futuro: PostgreSQL, MongoDB, etc
 */

export class DatabaseAdapter {
  constructor(type = 'memory') {
    this.type = type;
    this.data = {
      tenants: this.getTenantsSeedData(),
      users: this.getUsersSeedData(),
      cats: this.getCatsSeedData(),
      adoptions: [],
      medicalRecords: [],
      adopters: [],
    };
  }

  getTenantsSeedData() {
    return [
      {
        id: 'tenant-1',
        name: 'ONG A',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tenant-2',
        name: 'ONG B',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getUsersSeedData() {
    const hash = (plain) => bcrypt.hashSync(plain, 10);

    return [
      {
        id: 'super-1',
        tenant_id: null,
        email: 'superadmin@ong.com',
        password: hash('superadmin'),
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'admin-1',
        tenant_id: 'tenant-1',
        email: 'admin@ongA.com',
        password: hash('adminA'),
        role: 'org_admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'admin-2',
        tenant_id: 'tenant-2',
        email: 'admin@ongB.com',
        password: hash('adminB'),
        role: 'org_admin',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getCatsSeedData() {
    return [
      {
        id: 'cat-1',
        tenant_id: 'tenant-1',
        name: 'Mingau',
        photo:
          'https://images.unsplash.com/photo-1595433707802-68267d83760a?w=800',
        description: 'Um mestre em ronronar e pedir sachê.',
        status: 'available',
      },
      {
        id: 'cat-2',
        tenant_id: 'tenant-1',
        name: 'Luna',
        photo:
          'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800',
        description: 'Calma, elegante e adora janelas ensolaradas.',
        status: 'available',
      },
      {
        id: 'cat-3',
        tenant_id: 'tenant-2',
        name: 'Simba',
        photo:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
        description: 'O rei da sala de estar procura sua rainha.',
        status: 'available',
      },
    ];
  }

  getAllTenants() {
    return this.data.tenants;
  }

  findTenantById(tenantId) {
    return this.data.tenants.find((t) => t.id === tenantId) || null;
  }

  saveTenants(tenants) {
    this.data.tenants = tenants;
    return true;
  }

  getAllUsers(tenantId = null) {
    if (!tenantId) {
      return this.data.users;
    }
    return this.data.users.filter((u) => u.tenant_id === tenantId);
  }

  findUserByEmail(email, tenantId = null) {
    if (tenantId) {
      return this.data.users.find((u) => u.email === email && u.tenant_id === tenantId) || null;
    }
    return this.data.users.find((u) => u.email === email) || null;
  }

  saveUsers(users) {
    this.data.users = users;
    return true;
  }

  getAllCats(tenantId = null) {
    if (!tenantId) {
      return this.data.cats;
    }
    return this.data.cats.filter((c) => c.tenant_id === tenantId);
  }

  findCatById(catId, tenantId = null) {
    if (tenantId) {
      return this.data.cats.find((c) => c.id === catId && c.tenant_id === tenantId) || null;
    }
    return this.data.cats.find((c) => c.id === catId) || null;
  }

  saveCats(cats) {
    this.data.cats = cats;
    return true;
  }

  // === ADOPTIONS ===
  getAllAdoptions(tenantId = null) {
    if (!tenantId) {
      return this.data.adoptions;
    }
    // Para adoptions, filtrar por tenant através dos cats relacionados
    return this.data.adoptions.filter((a) => {
      const cat = this.findCatById(a.cat_id);
      return cat && cat.tenant_id === tenantId;
    });
  }

  saveAdoptions(adoptions) {
    this.data.adoptions = adoptions;
    return true;
  }

  // === MEDICAL RECORDS ===
  getAllMedicalRecords(tenantId = null) {
    if (!tenantId) {
      return this.data.medicalRecords;
    }
    return this.data.medicalRecords.filter((r) => r.tenant_id === tenantId);
  }

  saveMedicalRecords(medicalRecords) {
    this.data.medicalRecords = medicalRecords;
    return true;
  }
}

// Singleton: instância única do adapter
const databaseAdapter = new DatabaseAdapter('memory');
export default databaseAdapter;
