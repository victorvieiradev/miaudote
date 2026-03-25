import express from 'express';

/**
 * Factory para router de adoções
 * @param {Function} authMiddleware - Middleware de autenticação
 * @param {AdoptionRepository} adoptionRepository - Repositório de adoções
 * @returns {Router} Express router
 */
export const createAdoptionsRouter = (authMiddleware, adoptionRepository) => {
  const router = express.Router();

  // Todas as rotas requerem autenticação
  router.use(authMiddleware);

  // Listar adoções do tenant
  router.get('/', (req, res) => {
    const adoptions = adoptionRepository.getAll(req.tenantId);
    res.json(adoptions);
  });

  // Listar adoções pendentes
  router.get('/status/pending', (req, res) => {
    const pendingAdoptions = adoptionRepository.findPending(req.tenantId);
    res.json(pendingAdoptions);
  });

  // Buscar adoção por ID
  router.get('/:id', (req, res) => {
    const adoption = adoptionRepository.findById(req.params.id, req.tenantId);
    if (!adoption) {
      return res.status(404).json({ error: 'Adoption not found' });
    }
    res.json(adoption);
  });

  // Aprovar adoção
  router.put('/:id/approve', (req, res) => {
    try {
      const adoption = adoptionRepository.approve(req.params.id, req.body.notes || '', req.tenantId);
      res.json(adoption);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Rejeitar adoção
  router.put('/:id/reject', (req, res) => {
    try {
      const adoption = adoptionRepository.reject(req.params.id, req.body.reason || '', req.tenantId);
      res.json(adoption);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Completar adoção
  router.put('/:id/complete', (req, res) => {
    try {
      const adoption = adoptionRepository.complete(req.params.id, req.tenantId);
      res.json(adoption);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Atualizar adoção
  router.put('/:id', (req, res) => {
    try {
      const adoption = adoptionRepository.update(req.params.id, req.body, req.tenantId);
      res.json(adoption);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Deletar adoção
  router.delete('/:id', (req, res) => {
    try {
      adoptionRepository.delete(req.params.id, req.tenantId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  return router;
};

export default createAdoptionsRouter;