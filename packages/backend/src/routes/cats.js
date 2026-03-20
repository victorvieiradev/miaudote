import express from 'express';
import { CatRepository } from '../repository/CatRepository.js';
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

  router.get('/', (req, res) => {
    res.json(catRepository.getAll());
  });

  router.post('/', authMiddleware, (req, res) => {
    const newCat = new Cat(req.body);
    const cats = catRepository.getAll();
    cats.unshift(newCat);
    catRepository.save(cats);
    res.json(newCat);
  });

  router.put('/:id', authMiddleware, (req, res) => {
    const cats = catRepository.getAll();
    const index = cats.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Cat not found' });

    // Preserve the existing ID and build a fresh Cat instance so all fields are maintained
    const updatedCat = new Cat({ ...cats[index], ...req.body, id: cats[index].id });
    cats[index] = updatedCat;

    catRepository.save(cats);
    res.json(cats[index]);
  });

  router.delete('/:id', authMiddleware, (req, res) => {
    const cats = catRepository.getAll().filter(c => c.id !== req.params.id);
    catRepository.save(cats);
    res.json({ success: true });
  });

  router.put('/:id/adopt', authMiddleware, (req, res) => {
    const cats = catRepository.getAll();
    const index = cats.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Cat not found' });
    cats[index].status = 'adopted';
    cats[index].adopter = new Adopter(req.body.name, req.body.whatsapp);
    catRepository.save(cats);
    res.json(cats[index]);
  });

  return router;
};

export default createCatsRouter;