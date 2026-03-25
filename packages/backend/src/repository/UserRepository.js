/**
 * UserRepository - Gerencia persistência de usuários
 * Suporta injeção de dependência (database adapter)
 */
import { User } from '../entities/User.js';

export class UserRepository {
  constructor(databaseAdapter) {
    if (!databaseAdapter) {
      throw new Error('DatabaseAdapter é obrigatório no construtor de UserRepository');
    }
    this.database = databaseAdapter;
  }

  getAll(tenantId = null) {
    return this.database.getAllUsers(tenantId).map(u => new User(u));
  }

  findByEmail(email, tenantId = null) {
    const user = this.database.findUserByEmail(email, tenantId);
    return user ? new User(user) : null;
  }

  validateCredentials(email, password) {
    const user = this.findByEmail(email);

    if (!user || !user.isActive()) {
      return null;
    }

    // Em produção: comparar com hash bcrypt
    if (user.comparePassword(password)) {
      user.updateLastLogin();
      // Atualizar no banco
      const allUsers = this.database.getAllUsers().map(u =>
        u.id === user.id ? user : u
      );
      this.database.saveUsers(allUsers);

      // Retorna usuário sem expor a senha
      return user.toPublic();
    }

    return null;
  }

  isSuperAdmin(user) {
    return user instanceof User && user.isSuperAdmin();
  }

  isOrgAdmin(user) {
    return user instanceof User && user.isOrgAdmin();
  }

  createOrgAdmin({ tenant_id, email, password, name = '' }) {
    if (!tenant_id || !email || !password) {
      throw new Error('tenant_id, email e password são obrigatórios');
    }

    // Verificar se email já existe
    if (this.findByEmail(email)) {
      throw new Error('Email já cadastrado');
    }

    const newUser = new User({
      tenant_id,
      email,
      password,
      role: 'org_admin',
      name,
    });

    const users = this.database.getAllUsers();
    users.push(newUser);
    this.database.saveUsers(users);

    return newUser.toPublic();
  }

  createSuperAdmin({ email, password, name = '' }) {
    if (!email || !password) {
      throw new Error('email e password são obrigatórios');
    }

    // Verificar se já existe superadmin
    const existingSuper = this.getAll().find(u => u.isSuperAdmin());
    if (existingSuper) {
      throw new Error('Já existe um superadmin cadastrado');
    }

    const newUser = new User({
      email,
      password,
      role: 'superadmin',
      name,
    });

    const users = this.database.getAllUsers();
    users.push(newUser);
    this.database.saveUsers(users);

    return newUser.toPublic();
  }

  update(id, updates) {
    const user = this.getAll().find(u => u.id === id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const updatedUser = new User({
      ...user,
      ...updates,
      id: user.id,
      updatedAt: new Date().toISOString(),
    });

    const users = this.database.getAllUsers().map(u =>
      u.id === id ? updatedUser : u
    );
    this.database.saveUsers(users);

    return updatedUser.toPublic();
  }

  delete(id) {
    const users = this.database.getAllUsers().filter(u => u.id !== id);
    this.database.saveUsers(users);
    return true;
  }
}

export default UserRepository;
