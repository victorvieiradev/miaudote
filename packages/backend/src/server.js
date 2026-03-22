import express from 'express';
import cors from 'cors';
import { createCatsRouter } from './routes/cats.js';
import { createAuthMiddleware } from './middleware/AuthMiddleware.js';
import { createAuthRouter } from './routes/auth.js';
import { createTenantsRouter } from './routes/tenants.js';
import { UserRepository } from './repository/UserRepository.js';
import { CatRepository } from './repository/CatRepository.js';
import { TenantRepository } from './repository/TenantRepository.js';
import databaseAdapter from './database/DatabaseAdapter.js';

const app = express();
app.use(cors());
app.use(express.json());

// === INICIALIZAÇÃO DE DEPENDÊNCIAS ===
// Isso permite fácil troca de implementações (memória → BD)

// UserRepository para autenticação
const userRepository = new UserRepository(databaseAdapter);

// Repositórios com DatabaseAdapter injetado
const catRepository = new CatRepository(databaseAdapter);
const tenantRepository = new TenantRepository(databaseAdapter);

// Middleware de autenticação com UserRepository injetado
const authMiddleware = createAuthMiddleware(userRepository);

// Routers
const catsRouter = createCatsRouter(authMiddleware, catRepository);
const authRouter = createAuthRouter(userRepository);
const tenantsRouter = createTenantsRouter(tenantRepository, userRepository);

app.use('/auth', authRouter);
app.use('/tenants', authMiddleware, tenantsRouter);
app.use('/cats', catsRouter);

// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Database type: ${databaseAdapter.type}`);
  console.log(`👤 Users: ${userRepository.getAll().length}`);
  console.log(`🐱 Cats: ${catRepository.getAll().length}`);
});