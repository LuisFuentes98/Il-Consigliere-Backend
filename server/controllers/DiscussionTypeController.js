const db = require('../../database/models');

class DiscussionTypeController {

  static async getDiscussionTypes(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussionTypes = await db.Tipo_Punto.findAll();
        if (discussionTypes.length > 0) {
          res.json({
            success: true,
            discussionTypes: discussionTypes
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron tipos de puntos.'
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

module.exports = DiscussionTypeController;