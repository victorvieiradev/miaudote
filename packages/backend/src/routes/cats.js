import express from 'express';
import { CatRepository } from '../repository/CatRepository.js';
import { Cat } from '../entities/Cat.js';
import { Adopter } from '../entities/Adopter.js';

const router = express.Router();
const repo = new CatRepository();

router.get('/', (req, res) => {
  res.json(repo.getAll());
});

router.post('/', (req, res) => {
  const newCat = new Cat(req.body);
  const cats = repo.getAll();
  cats.unshift(newCat);
  repo.save(cats);
  res.json(newCat);
});

router.put('/:id', (req, res) => {
  const cats = repo.getAll();
  const index = cats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cat not found' });

  // Preserve the existing ID and build a fresh Cat instance so all fields are maintained
  const updatedCat = new Cat({ ...cats[index], ...req.body, id: cats[index].id });
  cats[index] = updatedCat;

  repo.save(cats);
  res.json(cats[index]);
});

router.delete('/:id', (req, res) => {
  const cats = repo.getAll().filter(c => c.id !== req.params.id);
  repo.save(cats);
  res.json({ success: true });
});

router.put('/:id/adopt', (req, res) => {
  const cats = repo.getAll();
  const index = cats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cat not found' });
  cats[index].status = 'adopted';
  cats[index].adopter = new Adopter(req.body.name, req.body.whatsapp);
  repo.save(cats);
  res.json(cats[index]);
});

export default router;