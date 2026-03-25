import bcrypt from 'bcryptjs';

/**
 * User Entity - Representa um usuário do sistema
 * Suporta superadmin e org_admin roles
 */
export class User {
  constructor({
    id,
    tenant_id = null,
    email,
    password,
    role,
    name = '',
    phone = '',
    avatar = '',
    status = 'active',
    lastLogin = null,
    createdAt = new Date().toISOString(),
    updatedAt = null,
  }) {
    this.id = id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.tenant_id = tenant_id;
    this.email = email;
    this.password = this._hashIfNeeded(password);
    this.role = role;
    this.name = name;
    this.phone = phone;
    this.avatar = avatar;
    this.status = status;
    this.lastLogin = lastLogin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (!this.password || this.password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    if (!['superadmin', 'org_admin'].includes(this.role)) {
      throw new Error('Role deve ser superadmin ou org_admin');
    }
    if (!['active', 'inactive', 'suspended'].includes(this.status)) {
      throw new Error('Status deve ser active, inactive ou suspended');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isSuperAdmin() {
    return this.role === 'superadmin';
  }

  isOrgAdmin() {
    return this.role === 'org_admin';
  }

  isActive() {
    return this.status === 'active';
  }

  updateLastLogin() {
    this.lastLogin = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  _hashIfNeeded(password) {
    if (!password) return password;
    const isAlreadyHashed = typeof password === 'string' && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
    return isAlreadyHashed ? password : bcrypt.hashSync(password, 10);
  }

  comparePassword(plainPassword) {
    if (!plainPassword || !this.password) return false;
    return bcrypt.compareSync(plainPassword, this.password);
  }

  // Retorna usuário sem senha para respostas da API
  toPublic() {
    const { password, ...publicUser } = this;
    return publicUser;
  }
}