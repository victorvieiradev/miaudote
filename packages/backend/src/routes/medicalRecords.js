import express from 'express';

/**
 * Factory para router de registros médicos
 * @param {Function} authMiddleware - Middleware de autenticação
 * @param {MedicalRecordRepository} medicalRecordRepository - Repositório de registros médicos
 * @returns {Router} Express router
 */
export const createMedicalRecordsRouter = (authMiddleware, medicalRecordRepository) => {
  const router = express.Router();

  // Todas as rotas requerem autenticação
  router.use(authMiddleware);

  // Listar registros médicos do tenant
  router.get('/', (req, res) => {
    const records = medicalRecordRepository.getAll(req.tenantId);
    res.json(records);
  });

  // Listar registros de um gato
  router.get('/cat/:catId', (req, res) => {
    const records = medicalRecordRepository.findByCatId(req.params.catId, req.tenantId);
    res.json(records);
  });

  // Listar registros por tipo
  router.get('/type/:type', (req, res) => {
    const records = medicalRecordRepository.findByType(req.params.type, req.tenantId);
    res.json(records);
  });

  // Listar follow-ups em atraso
  router.get('/followup/overdue', (req, res) => {
    const overdueRecords = medicalRecordRepository.findOverdueFollowUps(req.tenantId);
    res.json(overdueRecords);
  });

  // Relatórios
  router.get('/cat/:catId/vaccinations', (req, res) => {
    const vaccinations = medicalRecordRepository.getVaccinationHistory(req.params.catId, req.tenantId);
    res.json(vaccinations);
  });

  router.get('/cat/:catId/deworming', (req, res) => {
    const deworming = medicalRecordRepository.getDewormingHistory(req.params.catId, req.tenantId);
    res.json(deworming);
  });

  router.get('/cat/:catId/total-cost', (req, res) => {
    const totalCost = medicalRecordRepository.getTotalCost(req.params.catId, req.tenantId);
    res.json({ totalCost });
  });

  // Buscar registro por ID
  router.get('/:id', (req, res) => {
    const record = medicalRecordRepository.findById(req.params.id, req.tenantId);
    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.json(record);
  });

  // Criar registro médico
  router.post('/', (req, res) => {
    try {
      const record = medicalRecordRepository.create(req.body, req.tenantId);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Atualizar registro médico
  router.put('/:id', (req, res) => {
    try {
      const record = medicalRecordRepository.update(req.params.id, req.body, req.tenantId);
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Deletar registro médico
  router.delete('/:id', (req, res) => {
    try {
      medicalRecordRepository.delete(req.params.id, req.tenantId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  // Relatórios
  router.get('/cat/:catId/vaccinations', (req, res) => {
    const vaccinations = medicalRecordRepository.getVaccinationHistory(req.params.catId, req.tenantId);
    res.json(vaccinations);
  });

  router.get('/cat/:catId/deworming', (req, res) => {
    const deworming = medicalRecordRepository.getDewormingHistory(req.params.catId, req.tenantId);
    res.json(deworming);
  });

  router.get('/cat/:catId/total-cost', (req, res) => {
    const totalCost = medicalRecordRepository.getTotalCost(req.params.catId, req.tenantId);
    res.json({ totalCost });
  });

  return router;
};

export default createMedicalRecordsRouter;