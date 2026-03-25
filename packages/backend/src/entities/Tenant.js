/**
 * Tenant Entity - Representa uma ONG (Organização)
 * Suporta multi-tenancy no sistema
 */
export class Tenant {
  constructor({
    id,
    name,
    status = 'active',
    settings = {},
    logo = '',
    address = '',
    phone = '',
    email = '',
    website = '',
    description = '',
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }) {
    this.id = id || `tenant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.name = name;
    this.status = status;
    this.settings = settings;
    this.logo = logo;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Nome da ONG deve ter pelo menos 2 caracteres');
    }
    if (!['active', 'inactive', 'suspended'].includes(this.status)) {
      throw new Error('Status deve ser active, inactive ou suspended');
    }
    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error('Email da ONG inválido');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isActive() {
    return this.status === 'active';
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.updatedAt = new Date().toISOString();
  }

  // Método para verificar se tenant pode criar admins
  canCreateAdmins() {
    return this.isActive();
  }

  // Método para verificar se tenant pode gerenciar gatos
  canManageCats() {
    return this.isActive();
  }
}