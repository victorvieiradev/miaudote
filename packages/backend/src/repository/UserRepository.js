/**
 * UserRepository - Gerencia persistência de usuários
 * Suporta injeção de dependência (database adapter)
 */

export class UserRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de UserRepository');
    }
    this.database = databaseAdapter;
  }

  getAll(tenantId = null) {
    return this.database.getAllUsers(tenantId);
  }

  findByEmail(email, tenantId = null) {
    return this.database.findUserByEmail(email, tenantId);
  }

  validateCredentials(email, password) {
    const user = this.findByEmail(email);

    if (!user) {
      return null;
    }

    // Em produção: comparar com hash bcrypt
    if (user.password === password) {
      // Retorna usuário sem expor a senha
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  isSuperAdmin(user) {
    return user && user.role === 'superadmin';
  }

  isOrgAdmin(user) {
    return user && user.role === 'org_admin';
  }

  createOrgAdmin({ tenant_id, email, password }) {
    if (!tenant_id || !email || !password) {
      throw new Error('tenant_id, email e password são obrigatórios');
    }

    const existing = this.findByEmail(email, tenant_id);
    if (existing) {
      throw new Error('Usuário já existe nesta ONG');
    }

    const id = `user-${Date.now()}`;
    const newUser = {
      id,
      tenant_id,
      email,
      password,
      role: 'org_admin',
      createdAt: new Date().toISOString(),
    };

    const users = this.database.getAllUsers();
    users.push(newUser);
    this.database.saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  createSuperAdmin({ email, password }) {
    if (!email || !password) {
      throw new Error('email e password são obrigatórios');
    }

    const existing = this.findByEmail(email);
    if (existing) {
      throw new Error('Usuário já existe');
    }

    const id = `user-${Date.now()}`;
    const newUser = {
      id,
      tenant_id: null,
      email,
      password,
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    };

    const users = this.database.getAllUsers();
    users.push(newUser);
    this.database.saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }
}

export default UserRepository;
