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
      `SELECT e.idEjercicio, e.nombre, e.tipoContador, 
              re.cantSets, re.cantidad, re.orden
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
    const { idEjercicio, cantSets, cantidad, orden } = ejercicioData;
    const [result] = await pool.query(
      'INSERT INTO rutina_ejercicio (idRutina, idEjercicio, cantSets, cantidad, orden) VALUES (?, ?, ?, ?, ?)',
      [idRutina, idEjercicio, cantSets || 3, cantidad || 10, orden || null]
    );
    return result;
  }

  // Remover ejercicio de rutina
  static async removeEjercicio(idRutina, idEjercicio) {
    const [result] = await pool.query(
      'DELETE FROM rutina_ejercicio WHERE idRutina = ? AND idEjercicio = ?',
      [idRutina, idEjercicio]
    );
    return result;
  }

  // Asignar rutina a alumno
  static async assignToAlumno(idRutina, idPersona, estado = 'activa') {
    // Permite asignar la misma rutina múltiples veces con diferentes fechas
    // La PK incluye fechaAsignacion, por lo que NOW() garantiza unicidad
    const [result] = await pool.query(
      `INSERT INTO alumno_rutina (idPersona, idRutina, estado, fechaAsignacion) 
       VALUES (?, ?, ?, NOW())`,
      [idPersona, idRutina, estado]
    );
    return result;
  }

  // Desasignar rutina de alumno
  static async removeFromAlumno(idRutina, idPersona, fechaAsignacion = null) {
    // Si se especifica fechaAsignacion, elimina solo esa asignación
    // Si no, elimina la asignación más reciente
    let query, params;
    
    if (fechaAsignacion) {
      // Convertir fecha ISO a UNIX timestamp
      const fecha = new Date(fechaAsignacion);
      const unixTimestamp = Math.floor(fecha.getTime() / 1000);
      
      query = 'DELETE FROM alumno_rutina WHERE idRutina = ? AND idPersona = ? AND UNIX_TIMESTAMP(fechaAsignacion) = ?';
      params = [idRutina, idPersona, unixTimestamp];
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
      // Convertir fecha ISO a objeto Date y luego a UNIX timestamp
      const fecha = new Date(fechaAsignacion);
      const unixTimestamp = Math.floor(fecha.getTime() / 1000);
      
      // Usar UNIX_TIMESTAMP para comparación exacta
      query = 'UPDATE alumno_rutina SET estado = ? WHERE idRutina = ? AND idPersona = ? AND UNIX_TIMESTAMP(fechaAsignacion) = ?';
      params = [estado, idRutina, idPersona, unixTimestamp];
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
}
