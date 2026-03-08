import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class Persona {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM persona');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE idPersona = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE mail = ?', [email]);
    return rows[0];
  }

  static async findByRole(rol) {
    const [rows] = await pool.query('SELECT * FROM persona WHERE rol = ?', [rol]);
    return rows;
  }

  static async create(personaData) {
    const { idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero } = personaData;
    
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [result] = await pool.query(
      `INSERT INTO persona (idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, password, nivel, genero) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idPersona, nombre, mail, tel, rol, cantAlumnos, direccion, fechaNac, peso, altura, hashedPassword, nivel || 'Intermedio', genero || 'masculino']
    );
    return result;
  }

  static async update(id, personaData) {
    const fields = [];
    const values = [];
    
    Object.keys(personaData).forEach(key => {
      if (personaData[key] !== undefined && key !== 'idPersona') {
        fields.push(`${key} = ?`);
        values.push(personaData[key]);
      }
    });
    
    // Si se está actualizando la contraseña, hashearla
    if (personaData.password) {
      const passwordIndex = fields.indexOf('password = ?');
      if (passwordIndex !== -1) {
        const hashedPassword = await bcrypt.hash(personaData.password, SALT_ROUNDS);
        values[passwordIndex] = hashedPassword;
      }
    }
    
    values.push(id);
    const [result] = await pool.query(
      `UPDATE persona SET ${fields.join(', ')} WHERE idPersona = ?`,
      values
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM persona WHERE idPersona = ?', [id]);
    return result;
  }

  // Obtener rutinas asignadas a un alumno
  static async getRutinasAsignadas(idPersona) {
    const [rows] = await pool.query(
      `SELECT r.*, ar.estado, ar.fechaAsignacion 
       FROM rutina r
       INNER JOIN alumno_rutina ar ON r.idRutina = ar.idRutina
       WHERE ar.idPersona = ?
       ORDER BY ar.fechaAsignacion DESC`,
      [idPersona]
    );
    return rows;
  }

  // Obtener alumnos de un entrenador (si aplica)
  static async getAlumnos(idEntrenador) {
    const [rows] = await pool.query(
      `SELECT * FROM persona WHERE rol = 'alumno'`
    );
    return rows;
  }

  // Obtener alumnos paginados ordenados por última asignación de rutina
  static async getAlumnosPaginados(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Query principal: todos los alumnos con fecha de última asignación
    // Ordenamiento: PRIMERO los que tienen asignación más reciente, LUEGO los que nunca tuvieron
    const [rows] = await pool.query(
      `SELECT 
        p.idPersona,
        p.nombre,
        p.mail,
        p.tel,
        p.nivel,
        p.genero,
        p.fechaNac,
        p.peso,
        p.altura,
        p.direccion,
        MAX(ar.fechaAsignacion) AS ultima_asignacion,
        CASE 
          WHEN ar_future.idPersona IS NULL THEN 1
          ELSE 0
        END AS necesita_rutina
      FROM persona p
      LEFT JOIN alumno_rutina ar ON p.idPersona = ar.idPersona
      LEFT JOIN (
        SELECT DISTINCT idPersona
        FROM alumno_rutina
        WHERE fechaAsignacion >= CURDATE()
      ) ar_future ON p.idPersona = ar_future.idPersona
      WHERE p.rol = 'alumno'
      GROUP BY p.idPersona
      ORDER BY ultima_asignacion DESC, p.nombre ASC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return rows;
  }

  // Obtener total de alumnos (para metadata de paginación)
  static async getAlumnosCount() {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total FROM persona WHERE rol = 'alumno'`
    );
    return rows[0].total;
  }

  // Método de autenticación con bcrypt
  static async authenticate(email, password) {
    const persona = await this.findByEmail(email);
    
    if (!persona) {
      return null;
    }

    // Verificar la contraseña hasheada
    const isValid = await bcrypt.compare(password, persona.password);
    
    if (!isValid) {
      return null;
    }

    // Retornar persona sin el password
    const { password: _, ...personaSinPassword } = persona;
    return personaSinPassword;
  }
}
