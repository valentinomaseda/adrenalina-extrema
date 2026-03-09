import express from 'express';
import { rutinaController } from '../controllers/rutinaController.js';

const router = express.Router();

// Rutas de rutinas (plantilla)
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

// Rutas de personalización por alumno
router.get('/:id/alumnos-personalizaciones', rutinaController.getAlumnosConPersonalizaciones);
router.get('/:id/alumnos/:idAlumno/ejercicios', rutinaController.getAlumnoEjercicios);
router.get('/:id/alumnos/:idAlumno/full', rutinaController.getFullRutinaAlumno);
router.put('/:id/alumnos/:idAlumno/ejercicios/:idEjercicio', rutinaController.updateAlumnoEjercicio);
router.post('/:id/alumnos/:idAlumno/ejercicios', rutinaController.addAlumnoEjercicio);
router.delete('/:id/alumnos/:idAlumno/ejercicios/:idEjercicio', rutinaController.removeAlumnoEjercicio);

export default router;
