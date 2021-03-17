const db = require('../../database/models');

class UserRoleController {

    static async store(req, res) {
        const { cedula, id_permiso } = req.body;
        try {
            await db.sequelize.transaction(async t => {
                await db.Usuario_Permiso.create({ cedula: cedula, id_permiso: id_permiso });
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
                await db.Usuario_Permiso.destroy({ where: { cedula: req.params.cedula } });
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

module.exports = UserRoleController;
