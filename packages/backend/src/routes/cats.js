import express from 'express';
import { Cat } from '../entities/Cat.js';
import { Adopter } from '../entities/Adopter.js';

/**
 * Factory para router de gatos
 * Recebe middleware e repositório injetados
 * @param {Function} authMiddleware - Middleware de autenticação
 * @param {CatRepository} catRepository - Repositório de gatos
 * @returns {Router} Express router
 */
export const createCatsRouter = (authMiddleware, catRepository) => {
  const router = express.Router();

  // Rota pública para feed (todos os gatos disponíveis)
  router.get('/public', (req, res) => {
    return res.json(catRepository.getAll(null));
  });

  // Rota de catálogo para admin, com tenant scope
  router.get('/', authMiddleware, (req, res) => {
    return res.json(catRepository.getAll(req.tenantId));
  });

  router.post('/', authMiddleware, (req, res) => {
    const tenantId = req.tenantId;
    const newCat = catRepository.create(req.body, tenantId);
    res.status(201).json(newCat);
  });

  router.put('/:id', authMiddleware, (req, res) => {
    const cat = catRepository.findById(req.params.id, req.tenantId);
    if (!cat) return res.status(404).json({ error: 'Cat not found in tenant scope' });

    const updatedCat = new Cat({
      ...cat,
      ...req.body,
      id: cat.id,
      tenant_id: cat.tenant_id,
      updatedAt: new Date().toISOString(),
    });

    const allCats = catRepository.getAll(null).map((c) => (c.id === cat.id ? updatedCat : c));
    catRepository.save(allCats);

    res.json(updatedCat);
  });

  router.delete('/:id', authMiddleware, (req, res) => {
    const cat = catRepository.findById(req.params.id, req.tenantId);
    if (!cat) return res.status(404).json({ error: 'Cat not found in tenant scope' });

    const allCats = catRepository.getAll(null).filter((c) => c.id !== req.params.id);
    catRepository.save(allCats);
    res.json({ success: true });
  });

  router.put('/:id/adopt', authMiddleware, (req, res) => {
    const cat = catRepository.findById(req.params.id, req.tenantId);
    if (!cat) return res.status(404).json({ error: 'Cat not found in tenant scope' });

    const adoptedCat = new Cat({
      ...cat,
      status: 'adopted',
      adopter: new Adopter(req.body.name, req.body.whatsapp),
      updatedAt: new Date().toISOString(),
    });

    const allCats = catRepository.getAll(null).map((c) => (c.id === cat.id ? adoptedCat : c));
    catRepository.save(allCats);

    res.json(adoptedCat);
  });

  return router;
};

export default createCatsRouter;