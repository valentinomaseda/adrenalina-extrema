import express from 'express';
import { personaController } from '../controllers/personaController.js';

const router = express.Router();

// GET /api/profesora/alumnos - Obtener alumnos con paginación ordenados por última asignación
router.get('/alumnos', personaController.getAlumnosPaginados);

export default router;
