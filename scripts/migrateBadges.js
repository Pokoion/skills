import mongoose from 'mongoose';
import Badge from '../models/badge.js';  // Asegúrate de que el modelo Badge esté correctamente importado



async function normalizeTextField() {
    try {
        await mongoose.connect('mongodb://localhost:27017/skills', { useNewUrlParser: true, useUnifiedTopology: true });

        const result = await Badge.updateMany(
            { text: { $regex: /\n{3,}/ } }, // Buscar documentos con 3 o más \n consecutivos
            [
              {
                $set: {
                  text: {
                    $replaceAll: { input: '$text', find: '\n\n\n', replacement: '\n' },
                  },
                },
              },
            ]
          );
      
          console.log(`${result.modifiedCount} documentos actualizados.`);
        } catch (error) {
          console.error('Error actualizando los documentos:', error);
        } finally {
          mongoose.connection.close();
        }
}

normalizeTextField();
