import express from 'express';
import { Cat } from '../entities/Cat.js';
import { Adopter } from '../entities/Adopter.js';

/**
 * Factory para router de gatos
 * Recebe middleware e repositório injetados
 * @param {Function} authMiddleware - Middleware de autenticação
 * @param {CatRepository} catRepository - Repositório de gatos
 * @param {AdoptionRepository} adoptionRepository - Repositório de adoções
 * @param {AdopterRepository} adopterRepository - Repositório de adotantes
 * @returns {Router} Express router
 */
export const createCatsRouter = (authMiddleware, catRepository, adoptionRepository, adopterRepository) => {
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
    try {
      const tenantId = req.tenantId;
      const { vaccination, fivFelv, deworming, ...catPayload } = req.body;
      const newCat = catRepository.create({
        ...catPayload,
        status: catPayload.status || 'available',
        vaccination: vaccination || [],
        fivFelv: fivFelv || 'Não testado',
        deworming: deworming || '',
      }, tenantId);
      res.status(201).json(newCat);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  router.put('/:id', authMiddleware, (req, res) => {
    const cat = catRepository.findById(req.params.id, req.tenantId);
    if (!cat) return res.status(404).json({ error: 'Cat not found in tenant scope' });

    try {
      const { vaccination, fivFelv, deworming, ...catPayload } = req.body;
      const updatedCat = new Cat({
        ...cat,
        ...catPayload,
        id: cat.id,
        tenant_id: cat.tenant_id,
        updatedAt: new Date().toISOString(),
        vaccination: vaccination || cat.vaccination || [],
        fivFelv: fivFelv || cat.fivFelv || 'Não testado',
        deworming: deworming || cat.deworming || '',
      });

    const allCats = catRepository.getAll(null).map((c) => (c.id === cat.id ? updatedCat : c));
    catRepository.save(allCats);

    res.json(updatedCat);
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
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

    if (!cat.canBeAdopted()) {
      return res.status(400).json({ error: 'Cat is not available for adoption' });
    }

    try {
      // Criar adotante
      const adopter = adopterRepository.create({
        tenant_id: req.tenantId,
        name: req.body.name,
        whatsapp: req.body.whatsapp,
        email: req.body.email || '',
        phone: req.body.phone || '',
        address: req.body.address || '',
        homeType: req.body.homeType || '',
        hasOtherPets: !!req.body.hasOtherPets,
        otherPetsDetails: req.body.otherPetsDetails || '',
        familyComposition: req.body.familyComposition || '',
        hasChildren: !!req.body.hasChildren,
        childrenAges: req.body.childrenAges || '',
        workSchedule: req.body.workSchedule || '',
        adoptionReason: req.body.adoptionReason || '',
        previousExperience: req.body.previousExperience || '',
      });

      // Criar adoção
      const adoption = adoptionRepository.create({
        cat_id: cat.id,
        adopter_id: adopter.id,
        notes: req.body.notes || '',
      }, req.tenantId);

      // Marcar gato como adotado
      cat.markAsAdopted();

      // Salvar gato atualizado
      const allCats = catRepository.getAll(null).map((c) => (c.id === cat.id ? cat : c));
      catRepository.save(allCats);

      res.json({
        cat,
        adoption,
        adopter,
      });
    } catch (error) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  });

  return router;
};

export default createCatsRouter;