import express from 'express';
import { requireRole } from '../middleware/RoleMiddleware.js';

export const createTenantsRouter = (tenantRepository, userRepository) => {
  const router = express.Router();

  router.get('/', requireRole('superadmin'), (req, res) => {
    const tenants = tenantRepository.getAll();
    res.json(tenants);
  });

  router.post('/', requireRole('superadmin'), (req, res) => {
    const { name } = req.body;
    try {
      const tenant = tenantRepository.create({ name });
      res.status(201).json(tenant);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  router.post('/:tenantId/admins', requireRole('superadmin'), (req, res) => {
    const { tenantId } = req.params;
    const { email, password } = req.body;

    const tenant = tenantRepository.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: 'Not Found', message: 'ONG não encontrada' });
    }

    try {
      const admin = userRepository.createOrgAdmin({ tenant_id: tenantId, email, password });
      return res.status(201).json(admin);
    } catch (error) {
      return res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  return router;
};

export default createTenantsRouter;
