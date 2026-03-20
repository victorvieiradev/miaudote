import express from 'express';
import cors from 'cors';
import { createCatsRouter } from './routes/cats.js';
import { createAuthMiddleware } from './middleware/AuthMiddleware.js';
import { UserRepository } from './repository/UserRepository.js';
import { CatRepository } from './repository/CatRepository.js';
import databaseAdapter from './database/DatabaseAdapter.js';

const app = express();
app.use(cors());
app.use(express.json());

// === INICIALIZAÇÃO DE DEPENDÊNCIAS ===
// Isso permite fácil troca de implementações (memória → BD)

// UserRepository para autenticação
const userRepository = new UserRepository(databaseAdapter);

// Middleware de autenticação com UserRepository injetado
const authMiddleware = createAuthMiddleware(userRepository);

// CatRepository com DatabaseAdapter injetado
const catRepository = new CatRepository(databaseAdapter);

// Router de gatos com middlewares e repositório injetados
const catsRouter = createCatsRouter(authMiddleware, catRepository);

// Registra as rotas
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