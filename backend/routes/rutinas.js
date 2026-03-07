import express from 'express';
import { rutinaController } from '../controllers/rutinaController.js';

const router = express.Router();

// Rutas de rutinas
router.get('/', rutinaController.getAll);
router.get('/:id', rutinaController.getById);
router.get('/:id/full', rutinaController.getFullRutina);
router.get('/:id/ejercicios', rutinaController.getEjercicios);
router.get('/:id/alumnos', rutinaController.getAlumnos);
router.post('/', rutinaController.create);
router.post('/:id/ejercicios', rutinaController.addEjercicio);
router.post('/:id/asignar', rutinaController.assignToAlumno);
router.post('/:id/desasignar', rutinaController.removeFromAlumno);
router.put('/:id', rutinaController.update);
router.put('/:id/estado', rutinaController.updateEstado);
router.delete('/:id', rutinaController.delete);
router.delete('/:id/ejercicios/:idEjercicio', rutinaController.removeEjercicio);

export default router;
