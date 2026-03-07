import express from 'express';
import { personaController } from '../controllers/personaController.js';

const router = express.Router();

// Rutas de personas
router.post('/login', personaController.login);  // Login debe ir primero
router.get('/', personaController.getAll);
router.get('/:id', personaController.getById);
router.get('/rol/:rol', personaController.getByRole);
router.get('/:id/rutinas', personaController.getRutinas);
router.post('/', personaController.create);
router.put('/:id', personaController.update);
router.delete('/:id', personaController.delete);

export default router;
