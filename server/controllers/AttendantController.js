const db = require('../../database/models');
const nodemailer = require('nodemailer');

class AttendantController {

  static async getByCouncil(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const convocados = await db.Convocado.findAll({ attributes: ['cedula'], where: { consecutivo: req.params.consecutivo } });
        if (convocados.length > 0) {
          res.json({
            success: true,
            convocados: convocados
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron convocados.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async getUserNames(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const convocados = await db.sequelize.query(`SELECT "Usuario"."nombre", "Usuario"."apellido", "Usuario"."segundo_apellido", "Usuario"."id_tipo_convocado" FROM public."Usuario" INNER JOIN public."Convocado" ON "Usuario"."cedula" = "Convocado"."cedula" WHERE "Convocado"."consecutivo" = '${req.params.consecutivo}'`);
        if (convocados[0].length > 0) {
          res.json({
            success: true,
            convocados: convocados[0]
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron convocados.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async getByUser(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const convocados = await db.Convocado.findAll({ where: { cedula: req.params.cedula } });
        if (convocados.length > 0) {
          //for y recuperar los consejos
          res.json({
            success: true,
            convocados: convocados
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron convocados.'
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
    try {
      await db.sequelize.transaction(async t => {
        const { consecutivo, convocados} = req.body;
        let mailList = [];
        for (let i = 0; i < convocados.length; i++) {
          await db.Convocado.create({ cedula: convocados[i], consecutivo: consecutivo});
          let correos = await db.Correo.findAll({ attributes: ['correo'], where: { cedula: convocados[i] } });
          mailList = mailList.concat(correos);
        }
        if (mailList.length > 0) {
          const consejo = await db.Consejo.findOne({ where: { consecutivo: consecutivo } });
          const info = consejo.dataValues;
          let toList = [];
          for (let i = 0; i < mailList.length; i++) {
            toList.push(mailList[i].dataValues.correo);
          }
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${process.env.EMAIL}`,
              pass: `${process.env.EMAIL_PASS}`
            }
          });
          const mailOptions = {
            from: `${process.env.EMAIL}`,
            to: `${toList}`,
            subject: `Convocatoria al ${info.nombre_consejo} ${info.consecutivo}`,
            text:
              `Los administradores del Consejo de Ingeniería en Computación del Campus Tecnológico Local de San José le han convocado a la sesión ${info.id_tipo_sesion === 1 ? 'ordinaria' : info.id_tipo_sesion === 2 ? 'extraordinaria' : 'de Consulta Formal'} ${info.consecutivo}. Información de la Convocatoria:\n\n${info.institucion}\n${info.carrera}\n${info.campus}\n${info.nombre_consejo}\nLugar: ${info.lugar}\nFecha: ${info.fecha}\nHora: ${info.hora}\n\nPara visualizar los puntos de agenda, las personas convocadas y realizar solicitudes, por favor inicie sesión en ${process.env.PAGE_LINK}/acceso`
          };
          transporter.sendMail(mailOptions, (err, resp) => {
            if (err) {
              res.status(500).json({
                msg: 'Error.',
                err: err
              });
            } else {
              res.json({
                success: true,
                msg: resp
              });
            }
          });
        } else {
          res.json({
            success: true,
          });
        }
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
        await db.Convocado.destroy({ where: { consecutivo: req.params.consecutivo } });
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
        await db.Convocado.destroy({ where: { consecutivo: req.params.consecutivo, cedula: req.params.cedula } });
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
        for (let i = 0; i < req.body.noConvocados.length; i++) {
          let cedula = req.body.noConvocados[i];
          await db.Convocado.destroy({ where: { cedula: cedula, consecutivo: req.params.consecutivo } });
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
}

module.exports = AttendantController;