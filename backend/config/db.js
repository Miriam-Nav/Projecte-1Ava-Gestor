const mongoose = require('mongoose');

// Conecta la aplicación con la base de datos MongoDB usando la URL del archivo .env
async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        // Detiene el servidor si no hay conexión a la base de datos
        process.exit(1);
    }
}

module.exports = conectarDB;
