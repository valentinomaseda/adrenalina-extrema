import express from 'express';
import { ejercicioController } from '../controllers/ejercicioController.js';

const router = express.Router();

// Rutas de ejercicios
router.get('/', ejercicioController.getAll);
router.get('/:id', ejercicioController.getById);
router.get('/search/:nombre', ejercicioController.search);
router.get('/:id/rutinas', ejercicioController.getRutinas);
router.post('/', ejercicioController.create);
router.put('/:id', ejercicioController.update);
router.delete('/:id', ejercicioController.delete);

export default router;
