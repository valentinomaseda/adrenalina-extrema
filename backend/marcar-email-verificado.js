// Script para marcar usuarios existentes como verificados
import { pool } from './config/database.js';

async function marcarExistentesComoVerificados() {
  try {
    console.log('🔄 Actualizando usuarios existentes...');
    
    // Marcar como verificados todos los usuarios que ya tienen contraseña
    const [result] = await pool.query(
      'UPDATE persona SET email_verificado = TRUE WHERE password IS NOT NULL'
    );
    
    console.log(`✅ ${result.affectedRows} usuarios marcados como verificados`);
    
    // Mostrar resumen
    const [summary] = await pool.query(`
      SELECT 
        rol,
        email_verificado,
        COUNT(*) as total
      FROM persona
      GROUP BY rol, email_verificado
      ORDER BY rol, email_verificado
    `);
    
    console.log('\n📊 Resumen por rol:');
    console.table(summary);
    
    await pool.end();
    console.log('\n✨ Actualización completada exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

marcarExistentesComoVerificados();
