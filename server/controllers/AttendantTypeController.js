const db = require('../../database/models');

class AttendantTypeController {

  static async getAttendantTypes(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const attendantTypes = await db.Tipo_Convocado.findAll();
        if (attendantTypes.length > 0) {
          res.json({
            success: true,
            attendantTypes: attendantTypes
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron tipos de consejos.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }
}

module.exports = AttendantTypeController;