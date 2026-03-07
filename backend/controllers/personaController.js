import { Persona } from '../models/Persona.js';

export const personaController = {
  // GET /api/personas
  async getAll(req, res) {
    try {
      const personas = await Persona.findAll();
      res.json(personas);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      res.status(500).json({ error: 'Error al obtener personas' });
    }
  },

  // GET /api/personas/:id
  async getById(req, res) {
    try {
      const persona = await Persona.findById(req.params.id);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      res.json(persona);
    } catch (error) {
      console.error('Error al obtener persona:', error);
      res.status(500).json({ error: 'Error al obtener persona' });
    }
  },

  // GET /api/personas/rol/:rol
  async getByRole(req, res) {
    try {
      const personas = await Persona.findByRole(req.params.rol);
      res.json(personas);
    } catch (error) {
      console.error('Error al obtener personas por rol:', error);
      res.status(500).json({ error: 'Error al obtener personas' });
    }
  },

  // GET /api/personas/:id/rutinas
  async getRutinas(req, res) {
    try {
      const rutinas = await Persona.getRutinasAsignadas(req.params.id);
      res.json(rutinas);
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      res.status(500).json({ error: 'Error al obtener rutinas' });
    }
  },

  // POST /api/personas
  async create(req, res) {
    try {
      const result = await Persona.create(req.body);
      res.status(201).json({ 
        message: 'Persona creada exitosamente',
        id: req.body.idPersona 
      });
    } catch (error) {
      console.error('Error al crear persona:', error);
      res.status(500).json({ error: 'Error al crear persona' });
    }
  },

  // PUT /api/personas/:id
  async update(req, res) {
    try {
      const result = await Persona.update(req.params.id, req.body);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      res.json({ message: 'Persona actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      res.status(500).json({ error: 'Error al actualizar persona' });
    }
  },

  // DELETE /api/personas/:id
  async delete(req, res) {
    try {
      const result = await Persona.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      res.json({ message: 'Persona eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      res.status(500).json({ error: 'Error al eliminar persona' });
    }
  }
};
