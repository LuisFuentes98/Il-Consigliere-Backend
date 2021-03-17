const db = require('../../database/models');

class CouncilTypeController {

    static async getCouncilTypes(req, res) {
        try {
            await db.sequelize.transaction(async t => {
                const councilTypes = await db.Tipo_Sesion.findAll();
                if (councilTypes.length > 0) {
                    res.json({
                        success: true,
                        councilTypes: councilTypes
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

module.exports = CouncilTypeController;