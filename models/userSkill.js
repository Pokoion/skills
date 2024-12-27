const mongoose = require('mongoose');
const User = require('./user');

const userSkillSchema = new mongoose.Schema({
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    evidence: { type: String, default: null },
    verifications: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          approved: { type: Boolean, required: true },
          verifiedAt: { type: Date, required: true },
        }
      ],
});

// Middleware pre-update
userSkillSchema.pre('findOneAndUpdate', async function (next) {
  try {
      // Obtener el update de la consulta
      const update = this.getUpdate();
      const userSkillId = this.getQuery()._id;

      // Verificar si verifications está presente en $push
      if (update.$push && update.$push.verifications) {
        // Asegurarnos de que verifications es un array
        let verificationsToAdd = update.$push.verifications;
        if (!Array.isArray(verificationsToAdd)) {
            verificationsToAdd = [verificationsToAdd];  // Convertir en array si no lo es
        }

        // Obtener el documento original
        const existingUserSkill = await this.model.findById(userSkillId);
        if (!existingUserSkill) {
            throw new Error('UserSkill not found');
        }

        // Combinar las verificaciones existentes con las nuevas
        const existingVerifications = existingUserSkill.verifications || [];
        const allVerifications = [...existingVerifications, ...verificationsToAdd];

          // Filtrar las verificaciones aprobadas
          const verifiedUsers = allVerifications.filter(v => v.approved);

          // Si no hay usuarios aprobados, se mantiene completed como false
          if (verifiedUsers.length === 0) {
              update.$set = update.$set || {};
              update.$set.completed = false;
              return next();
          }

          // Verificar si algún administrador ha aprobado
          const adminApproval = await Promise.all(
              verifiedUsers.map(async v => {
                  const user = await User.findById(v.user);
                  return user && user.admin;  // Verificar si el usuario es admin
              })
          );

          let skillCompleted = false;

          // Si alguno de los aprobadores es admin, se marca como completado
          if (adminApproval.includes(true)) {
              skillCompleted = true;
              update.$set = update.$set || {};
              update.$set.completed = true;
              update.$set.completedAt = new Date();
          }

          // Verificar si hay al menos 3 usuarios aprobados
          console.log('All verifications:', verifiedUsers);
          const uniqueApprovedUsers = new Set(verifiedUsers.map(v => v.user.toString()));
          console.log('Unique approved users:', uniqueApprovedUsers);
          if (uniqueApprovedUsers.size >= 3) {
              skillCompleted = true;
              update.$set = update.$set || {};
              update.$set.completed = true;
              update.$set.completedAt = new Date();
          }

          // Si se marca como completado, actualizar el User y agregar el Skill a completedSkills
          if (skillCompleted) {
              const skillId = existingUserSkill.skill; // ID del Skill relacionado
              const userId = existingUserSkill.user;   // ID del User relacionado
          
              // Actualizar el User y agregar el Skill a completedSkills
              const user = await User.findById(userId);
              if (user && !user.completedSkills.includes(skillId)) {
                  user.completedSkills.push(skillId);
                  await user.save(); // Guardar los cambios en el User
              }
          } else {
              update.$set = update.$set || {};
              update.$set.completed = false;
          }
      }

      // Continuar con la actualización
      next();
  } catch (error) {
      // Manejo de errores
      next(error);
  }
});


module.exports = mongoose.model('UserSkill', userSkillSchema);