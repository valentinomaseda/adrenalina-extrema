// Script para probar el envío de email de confirmación con el nuevo diseño
import { enviarEmailConfirmacion } from './utils/emailService.js';
import { pool } from './config/database.js';

async function probarEmailConfirmacion() {
  try {
    // Pedir email de destino
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const email = await new Promise((resolve) => {
      rl.question('Ingresa el email de destino para probar: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });

    console.log('\n🔄 Enviando email de prueba...');
    
    // Buscar un usuario para obtener ID
    const [rows] = await pool.query('SELECT idPersona FROM persona WHERE mail = ? LIMIT 1', [email]);
    
    let idPersona;
    if (rows.length > 0) {
      idPersona = rows[0].idPersona;
      console.log(`✓ Usuario encontrado con ID: ${idPersona}`);
    } else {
      // Crear un ID temporal para prueba
      idPersona = 999;
      console.log('⚠ Usuario no encontrado, usando ID temporal para prueba');
    }

    // Enviar email
    const resultado = await enviarEmailConfirmacion({
      idPersona: idPersona,
      email: email,
      nombre: 'Usuario de Prueba'
    });

    if (resultado.success) {
      console.log('\n✅ Email enviado exitosamente!');
      console.log(`📧 ID del mensaje: ${resultado.messageId}`);
      console.log('\n🎨 El email ahora usa los colores de la app:');
      console.log('  • Cyan (#00BFFF) - Color principal');
      console.log('  • Azul (#1E40AF) - Color secundario');
      console.log('  • Sin naranja ✓');
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

probarEmailConfirmacion();
