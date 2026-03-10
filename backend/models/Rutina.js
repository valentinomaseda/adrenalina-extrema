import { pool } from '../config/database.js';

export class Rutina {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM rutina ORDER BY fechaHoraCreacion DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM rutina WHERE idRutina = ?', [id]);
    return rows[0];
  }

  static async create(rutinaData) {
    const { idRutina, nombre, fechaHoraCreacion } = rutinaData;
    const [result] = await pool.query(
      'INSERT INTO rutina (idRutina, nombre, fechaHoraCreacion) VALUES (?, ?, ?)',
      [idRutina, nombre, fechaHoraCreacion || new Date()]
    );
    return result;
  }

  static async update(id, rutinaData) {
    const fields = [];
    const values = [];
    
    Object.keys(rutinaData).forEach(key => {
      if (rutinaData[key] !== undefined && key !== 'idRutina') {
        fields.push(`${key} = ?`);
        values.push(rutinaData[key]);
      }
    });
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE rutina SET ${fields.join(', ')} WHERE idRutina = ?`,
      values
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM rutina WHERE idRutina = ?', [id]);
    return result;
  }

  // Obtener ejercicios de una rutina
  static async getEjercicios(idRutina) {
    const [rows] = await pool.query(
      `SELECT e.idEjercicio, e.nombre, e.tipoContador, e.unidad,
              e.distancia, e.duracion, e.descripcionIntervalo,
              re.id as rutinaEjercicioId, re.cantSets, re.cantidad, re.orden,
              re.pausaSeries, re.intensidad, re.esCalentamiento
       FROM ejercicio e
       INNER JOIN rutina_ejercicio re ON e.idEjercicio = re.idEjercicio
       WHERE re.idRutina = ?
       ORDER BY re.orden`,
      [idRutina]
    );
    return rows;
  }

  // Agregar ejercicio a rutina
  static async addEjercicio(idRutina, ejercicioData) {
    const { 
      idEjercicio, 
      cantSets, 
      cantidad, 
      orden,
      pausaSeries,
      intensidad,
      esCalentamiento
    } = ejercicioData;
    
    const [result] = await pool.query(
      `INSERT INTO rutina_ejercicio 
       (idRutina, idEjercicio, cantSets, cantidad, orden, pausaSeries, intensidad, esCalentamiento) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idRutina, 
        idEjercicio, 
        cantSets || 3, 
        cantidad || 10, 
        orden || null,
        pausaSeries || null,
        intensidad || null,
        esCalentamiento || false
      ]
    );
    return result;
  }

  // Remover ejercicio de rutina por ID único
  static async removeEjercicio(rutinaEjercicioId) {
    const [result] = await pool.query(
      'DELETE FROM rutina_ejercicio WHERE id = ?',
      [rutinaEjercicioId]
    );
    return result;
  }

  // Asignar rutina a alumno CON ejercicios personalizables
  static async assignToAlumno(idRutina, idPersona, estado = 'activa') {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. Crear relación alumno_rutina y obtener la fecha de asignación
      const [insertResult] = await connection.query(
        `INSERT INTO alumno_rutina (idPersona, idRutina, estado, fechaAsignacion) 
         VALUES (?, ?, ?, NOW())`,
        [idPersona, idRutina, estado]
      );
      
      // 2. Obtener la fecha recién insertada
      const [fechaResult] = await connection.query(
        `SELECT fechaAsignacion FROM alumno_rutina 
         WHERE idPersona = ? AND idRutina = ? 
         ORDER BY fechaAsignacion DESC LIMIT 1`,
        [idPersona, idRutina]
      );
      const fechaAsignacion = fechaResult[0].fechaAsignacion;
      
      // 3. Copiar ejercicios de la plantilla con valores default
      await connection.query(
        `INSERT INTO alumno_rutina_ejercicio 
         (idPersona, idRutina, fechaAsignacion, idEjercicio, cantSets, cantidad, orden, 
          pausaSeries, intensidad, esCalentamiento)
         SELECT ?, re.idRutina, ?, 
                re.idEjercicio, re.cantSets, re.cantidad, re.orden,
                re.pausaSeries, re.intensidad, re.esCalentamiento
         FROM rutina_ejercicio re
         WHERE re.idRutina = ?`,
        [idPersona, fechaAsignacion, idRutina]
      );
      
      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Desasignar rutina de alumno
  static async removeFromAlumno(idRutina, idPersona, fechaAsignacion = null) {
    // Si se especifica fechaAsignacion, elimina solo esa asignación
    // Si no, elimina la asignación más reciente
    let query, params;
    
    if (fechaAsignacion) {
      query = 'DELETE FROM alumno_rutina WHERE idRutina = ? AND idPersona = ? AND fechaAsignacion = ?';
      params = [idRutina, idPersona, fechaAsignacion];
    } else {
      query = `DELETE FROM alumno_rutina 
               WHERE idRutina = ? AND idPersona = ? 
               AND fechaAsignacion = (
                 SELECT fechaAsignacion FROM (
                   SELECT fechaAsignacion FROM alumno_rutina 
                   WHERE idRutina = ? AND idPersona = ?
                   ORDER BY fechaAsignacion DESC LIMIT 1
                 ) AS temp
               )`;
      params = [idRutina, idPersona, idRutina, idPersona];
    }
    
    const [result] = await pool.query(query, params);
    return result;
  }

  // Actualizar estado de rutina asignada
  static async updateEstadoAsignacion(idRutina, idPersona, estado, fechaAsignacion = null) {
    // Si se especifica fechaAsignacion, actualiza solo esa asignación
    // Si no, actualiza la asignación más reciente
    let query, params;
    
    if (fechaAsignacion) {
      query = 'UPDATE alumno_rutina SET estado = ? WHERE idRutina = ? AND idPersona = ? AND fechaAsignacion = ?';
      params = [estado, idRutina, idPersona, fechaAsignacion];
    } else {
      query = `UPDATE alumno_rutina SET estado = ? 
               WHERE idRutina = ? AND idPersona = ? 
               AND fechaAsignacion = (
                 SELECT fechaAsignacion FROM (
                   SELECT fechaAsignacion FROM alumno_rutina 
                   WHERE idRutina = ? AND idPersona = ?
                   ORDER BY fechaAsignacion DESC LIMIT 1
                 ) AS temp
               )`;
      params = [estado, idRutina, idPersona, idRutina, idPersona];
    }
    
    const [result] = await pool.query(query, params);
    return result;
  }

  // Obtener alumnos con esta rutina asignada
  static async getAlumnos(idRutina) {
    const [rows] = await pool.query(
      `SELECT p.*, ar.estado, ar.fechaAsignacion
       FROM persona p
       INNER JOIN alumno_rutina ar ON p.idPersona = ar.idPersona
       WHERE ar.idRutina = ?`,
      [idRutina]
    );
    return rows;
  }

  // Obtener rutina completa con ejercicios
  static async getFullRutina(idRutina) {
    const rutina = await this.findById(idRutina);
    if (!rutina) return null;
    
    const ejercicios = await this.getEjercicios(idRutina);
    return {
      ...rutina,
      ejercicios
    };
  }

  // ============================================
  // MÉTODOS DE PERSONALIZACIÓN POR ALUMNO
  // ============================================

  // Obtener ejercicios personalizados del alumno
  static async getAlumnoEjercicios(idRutina, idPersona) {
    const [rows] = await pool.query(
      `SELECT e.idEjercicio, e.nombre, e.tipoContador, e.unidad,
              e.distancia, e.duracion, e.descripcionIntervalo,
              are.cantSets, are.cantidad, are.especificaciones, are.orden,
              are.pausaSeries, are.intensidad, are.esCalentamiento
       FROM ejercicio e
       INNER JOIN alumno_rutina_ejercicio are ON e.idEjercicio = are.idEjercicio
       WHERE are.idRutina = ? AND are.idPersona = ?
       ORDER BY are.orden`,
      [idRutina, idPersona]
    );
    return rows;
  }

  // Actualizar ejercicio personalizado del alumno
  static async updateAlumnoEjercicio(idPersona, idRutina, idEjercicio, updates) {
    const fields = [];
    const values = [];
    
    if (updates.cantSets !== undefined) {
      fields.push('cantSets = ?');
      values.push(updates.cantSets);
    }
    if (updates.cantidad !== undefined) {
      fields.push('cantidad = ?');
      values.push(updates.cantidad);
    }
    if (updates.especificaciones !== undefined) {
      fields.push('especificaciones = ?');
      values.push(updates.especificaciones);
    }
    if (updates.pausaSeries !== undefined) {
      fields.push('pausaSeries = ?');
      values.push(updates.pausaSeries);
    }
    if (updates.intensidad !== undefined) {
      fields.push('intensidad = ?');
      values.push(updates.intensidad);
    }
    if (updates.esCalentamiento !== undefined) {
      fields.push('esCalentamiento = ?');
      values.push(updates.esCalentamiento);
    }
    if (updates.orden !== undefined) {
      fields.push('orden = ?');
      values.push(updates.orden);
    }
    
    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    values.push(idPersona, idRutina, idEjercicio);
    
    const [result] = await pool.query(
      `UPDATE alumno_rutina_ejercicio 
       SET ${fields.join(', ')} 
       WHERE idPersona = ? AND idRutina = ? AND idEjercicio = ?`,
      values
    );
    return result;
  }

  // Agregar ejercicio personalizado a rutina de alumno
  static async addAlumnoEjercicio(idPersona, idRutina, ejercicioData) {
    const { 
      idEjercicio, 
      cantSets, 
      cantidad, 
      especificaciones, 
      orden,
      pausaSeries,
      intensidad,
      esCalentamiento
    } = ejercicioData;
    
    const [result] = await pool.query(
      `INSERT INTO alumno_rutina_ejercicio 
       (idPersona, idRutina, idEjercicio, cantSets, cantidad, especificaciones, orden, 
        pausaSeries, intensidad, esCalentamiento) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPersona, 
        idRutina, 
        idEjercicio, 
        cantSets || 3, 
        cantidad || 10, 
        especificaciones || null, 
        orden || null,
        pausaSeries || null,
        intensidad || null,
        esCalentamiento || false
      ]
    );
    return result;
  }

  // Eliminar ejercicio personalizado de alumno
  static async removeAlumnoEjercicio(idPersona, idRutina, idEjercicio) {
    const [result] = await pool.query(
      `DELETE FROM alumno_rutina_ejercicio 
       WHERE idPersona = ? AND idRutina = ? AND idEjercicio = ?`,
      [idPersona, idRutina, idEjercicio]
    );
    return result;
  }

  // Obtener rutina completa del alumno con ejercicios personalizados
  static async getFullRutinaAlumno(idRutina, idPersona) {
    // Obtener datos de la rutina
    const rutina = await this.findById(idRutina);
    if (!rutina) return null;
    
    // Obtener estado de asignación
    const [asignacion] = await pool.query(
      `SELECT estado, fechaAsignacion 
       FROM alumno_rutina 
       WHERE idRutina = ? AND idPersona = ?`,
      [idRutina, idPersona]
    );
    
    if (asignacion.length === 0) return null;
    
    // Obtener ejercicios personalizados
    const ejercicios = await this.getAlumnoEjercicios(idRutina, idPersona);
    
    return {
      ...rutina,
      estado: asignacion[0].estado,
      fechaAsignacion: asignacion[0].fechaAsignacion,
      ejercicios
    };
  }

  // Obtener alumnos con rutina asignada y sus personalizaciones
  static async getAlumnosConPersonalizaciones(idRutina) {
    const [rows] = await pool.query(
      `SELECT 
         p.idPersona,
         p.nombre,
         p.mail,
         ar.estado,
         ar.fechaAsignacion,
         COUNT(are.idEjercicio) as cantEjercicios
       FROM persona p
       INNER JOIN alumno_rutina ar ON p.idPersona = ar.idPersona
       LEFT JOIN alumno_rutina_ejercicio are ON ar.idPersona = are.idPersona AND ar.idRutina = are.idRutina
       WHERE ar.idRutina = ?
       GROUP BY p.idPersona, p.nombre, p.mail, ar.estado, ar.fechaAsignacion
       ORDER BY ar.fechaAsignacion DESC`,
      [idRutina]
    );
    return rows;
  }
}
