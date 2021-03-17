const db = require('../../database/models');

class DiscussionController {

  static async getDiscussions(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussions = await db.Punto.findAll({ attributes: ['id_punto', 'asunto', 'orden', 'id_tipo_punto'], where: { consecutivo: req.params.consecutivo, id_estado_punto: 1 }, order: [['orden', 'ASC']] });
        if (discussions.length > 0) {
          res.json({
            success: true,
            discussions: discussions
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron puntos.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async getRequests(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussions = await db.sequelize.query(`SELECT "Punto"."id_punto", "Punto"."asunto", "Usuario"."nombre", "Usuario"."apellido" FROM public."Punto" INNER JOIN public."Usuario" ON "Punto"."cedula" = "Usuario"."cedula" WHERE "Punto"."consecutivo" = '${req.params.consecutivo}' AND "Punto"."id_estado_punto" = 2`);
        if (discussions[0].length > 0) {
          res.json({
            success: true,
            discussions: discussions[0]
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron puntos.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async getRequestsByUser(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussions = await db.Punto.findAll({ attributes: ['id_punto', 'asunto'], where: { consecutivo: req.params.consecutivo, cedula: req.params.cedula, id_estado_punto: 2 } });
        if (discussions.length > 0) {
          res.json({
            success: true,
            discussions: discussions
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron puntos.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async getVotingDiscussions(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussions = await db.sequelize.query(`SELECT "Punto"."id_punto", "Punto"."asunto", "Punto"."id_tipo_punto", "Votacion"."favor", "Votacion"."contra", "Votacion"."abstencion" FROM public."Punto" LEFT JOIN public."Votacion" ON "Punto"."id_punto" = "Votacion"."id_punto" WHERE "Punto"."consecutivo" = '${req.params.consecutivo}' AND "Punto"."id_estado_punto" = 1 ORDER BY "Punto"."orden"`);
        if (discussions[0].length > 0) {
          res.json({
            success: true,
            discussions: discussions[0]
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron puntos.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async store(req, res) {
    const { consecutivo, asunto, orden, cedula, id_estado_punto, id_tipo_punto } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.create({
          consecutivo: consecutivo, asunto: asunto, id_estado_punto: id_estado_punto,
          cedula: cedula, id_tipo_punto: id_tipo_punto, orden: orden
        });
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async updateDiscussionsState(req, res) {
    const { id_estado_punto, asunto, orden } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.update({ id_estado_punto: id_estado_punto, asunto: asunto, orden: orden }, { where: { id_punto: req.params.id_punto } });
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async updateOrder(req, res) {
    const { puntos } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        for (let i = 0; i < puntos.length; i++) {
          await db.Punto.update({ orden: i }, { where: { id_punto: puntos[i].id_punto } });
        }
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async remove(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.destroy({ where: { id_punto: req.params.id_punto } });
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async removeByCouncil(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.destroy({ where: { consecutivo: req.params.consecutivo } });
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async removeByUser(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.destroy({ where: { cedula: req.params.cedula } });
        res.json({
          success: true
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }
}

module.exports = DiscussionController;