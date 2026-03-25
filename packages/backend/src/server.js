import express from 'express';
import cors from 'cors';
import { createCatsRouter } from './routes/cats.js';
import { createAuthMiddleware } from './middleware/AuthMiddleware.js';
import { createAuthRouter } from './routes/auth.js';
import { createTenantsRouter } from './routes/tenants.js';
import { createAdoptionsRouter } from './routes/adoptions.js';
import { createMedicalRecordsRouter } from './routes/medicalRecords.js';
import { UserRepository } from './repository/UserRepository.js';
import { CatRepository } from './repository/CatRepository.js';
import { TenantRepository } from './repository/TenantRepository.js';
import { AdoptionRepository } from './repository/AdoptionRepository.js';
import { MedicalRecordRepository } from './repository/MedicalRecordRepository.js';
import { AdopterRepository } from './repository/AdopterRepository.js';
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
const adoptionRepository = new AdoptionRepository(databaseAdapter);
const medicalRecordRepository = new MedicalRecordRepository(databaseAdapter);
const adopterRepository = new AdopterRepository(databaseAdapter);

// Middleware de autenticação com UserRepository injetado
const authMiddleware = createAuthMiddleware(userRepository);

// Routers
const catsRouter = createCatsRouter(authMiddleware, catRepository, adoptionRepository, adopterRepository);
const authRouter = createAuthRouter(userRepository);
const tenantsRouter = createTenantsRouter(tenantRepository, userRepository);
const adoptionsRouter = createAdoptionsRouter(authMiddleware, adoptionRepository);
const medicalRecordsRouter = createMedicalRecordsRouter(authMiddleware, medicalRecordRepository);

app.use('/auth', authRouter);
app.use('/tenants', authMiddleware, tenantsRouter);
app.use('/cats', catsRouter);
app.use('/adoptions', adoptionsRouter);
app.use('/medical-records', medicalRecordsRouter);

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