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
      `SELECT e.* FROM ejercicio e
       INNER JOIN rutina_ejercicio re ON e.idEjercicio = re.idEjercicio
       WHERE re.idRutina = ?`,
      [idRutina]
    );
    return rows;
  }

  // Agregar ejercicio a rutina
  static async addEjercicio(idRutina, idEjercicio) {
    const [result] = await pool.query(
      'INSERT INTO rutina_ejercicio (idRutina, idEjercicio) VALUES (?, ?)',
      [idRutina, idEjercicio]
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
    const [result] = await pool.query(
      'INSERT INTO alumno_rutina (idPersona, idRutina, estado, fechaAsignacion) VALUES (?, ?, ?, ?)',
      [idPersona, idRutina, estado, new Date()]
    );
    return result;
  }

  // Actualizar estado de rutina asignada
  static async updateEstadoAsignacion(idRutina, idPersona, estado) {
    const [result] = await pool.query(
      'UPDATE alumno_rutina SET estado = ? WHERE idRutina = ? AND idPersona = ?',
      [estado, idRutina, idPersona]
    );
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
