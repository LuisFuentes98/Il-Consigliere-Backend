const db = require('../../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();

class UserController {

  static async getUsers(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const users = await db.Usuario.findAll({
          attributes: ['cedula', 'nombre', 'apellido', 'segundo_apellido'], order: ['nombre']
        });
        if (users.length > 0) {
          res.json({
            success: true,
            users: users
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontraron usuarios.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async passwordReset(req, res) {
    let { correos, cedula } = req.body;
    const formatoCorreos = [];
    for (let i = 0; i < correos.length; i++) {
      formatoCorreos.push(correos[i].correo);
    }
    try {
      await db.sequelize.transaction(async t => {
        const token = crypto.randomBytes(20).toString('Hex');
        await db.Link.create({
          token: token,
          expiration: Date.now() + 10800000,
          cedula: cedula
        });
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASS}`
          }
        });
        const mailOptions = {
          from: `${process.env.EMAIL}`,
          to: `${formatoCorreos}`,
          subject: 'Solicitud de nueva contraseña en Il Consigliere',
          text:
            `Usted ha solicitado cambiar su contraseña, por favor haga click en la siguiente dirección y llene los datos solicitados:\n\nhttps://il-consigliere.herokuapp.com/gUsuarios/cambioClave/${token}\n\nSe le recuerda que esta dirección expirará en 3 horas.\n\nSaludos,\nConsejo de Ingeniería en Computación.`
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
        })
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async sendLink(req, res) {
    const { correo, permisos, id_tipo_convocado } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        const token = crypto.randomBytes(20).toString('Hex');
        if (permisos.length === 0) {
          await db.Link.create({
            token: token,
            expiration: Date.now() + 10800000,
            id_tipo_convocado: id_tipo_convocado
          });
        } else {
          for (let i = 0; i < permisos.length; i++) {
            await db.Link.create({
              token: token,
              expiration: Date.now() + 10800000,
              id_tipo_convocado: id_tipo_convocado,
              id_permiso: permisos[i]
            });
          }
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
          to: `${correo}`,
          subject: 'Crea tu cuenta en Il Consigliere',
          text:
            `Los administradores del Consejo de Ingeniería en Computación del Campus Tecnológico Local de San José han solicitado que seas un participante en el Consejo de Unidad Desconcentrada, por favor haz click en la siguiente dirección y llena los datos solicitados:\n\nhttps://il-consigliere.herokuapp.com/gUsuarios/registro/${token}\n\nSe le recuerda que esta dirección expirará en 3 horas.\n\nSaludos,\nConsejo de Ingeniería en Computación.`
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
        })
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async verifyLink(req, res) {
    const token = req.params.token;
    try {
      await db.sequelize.transaction(async t => {
        const links = await db.Link.findAll({
          attributes: ['id_permiso', 'id_tipo_convocado'],
          where: { token: token, expiration: { [Op.gt]: Date.now() } }
        });
        await db.Link.destroy({ where: { token: token } });
        if (links.length !== 0) {
          res.json({
            success: true,
            links: links
          });
        } else {
          res.json({
            success: false,
            msg: 'La dirección ha expirado o es inválida.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async verifyRecovery(req, res) {
    const token = req.params.token;
    try {
      await db.sequelize.transaction(async t => {
        const link = await db.Link.findOne({
          where: { token: token, expiration: { [Op.gt]: Date.now() } }
        });
        await db.Link.destroy({ where: { token: token } });
        if (link) {
          res.json({
            success: true,
            cedula: link.cedula
          });
        } else {
          res.json({
            success: false,
            msg: 'La dirección ha expirado o es inválida.'
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
    const { cedula, nombre, apellido, segundo_apellido, clave, id_tipo_convocado } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        const encryptedPass = await this.encryptPassword(clave);
        await db.Usuario.create({
          cedula: cedula, nombre: nombre, apellido: apellido, segundo_apellido: segundo_apellido,
          clave: encryptedPass, id_tipo_convocado: id_tipo_convocado
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

  static async authenticate(req, res) {
    const { cedula, clave } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        const user = await db.Usuario.findOne({ where: { cedula: cedula } });
        if (user) {
          const match = await bcrypt.compare(clave, user.clave);
          if (match) {
            const info = {
              cedula: user.cedula,
              nombre: user.nombre,
              apellido: user.apellido,
              segundo_apellido: user.segundo_apellido
            }
            const token = jwt.sign({ user: info }, process.env.KEY,
              { algorithm: 'HS512' });
            res.json({
              success: true,
              token: token,
              info: info
            });
          } else {
            res.json({
              success: false,
              msg: 'Credenciales Incorrectos.'
            });
          }
        } else {
          res.json({
            success: false,
            msg: 'Usuario no existe.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async changePassword(req, res) {
    const { cedula, clave } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        const encryptedPass = await this.encryptPassword(clave);
        await db.Usuario.update({ clave: encryptedPass },
          { where: { cedula: cedula } });
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

  static async getUser(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const user = await db.Usuario.findOne({
          attributes: ['cedula', 'nombre', 'apellido', 'segundo_apellido', 'id_tipo_convocado'],
          where: { cedula: req.params.cedula }
        });
        if (user) {
          res.json({
            success: true,
            user: user
          });
        } else {
          res.json({
            success: false,
            msg: 'No se encontró el usuario.'
          });
        }
      })
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async remove(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        await db.Usuario.destroy({ where: { cedula: req.params.cedula } });
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

  static async update(req, res) {
    const { cedula, nombre, apellido, segundo_apellido } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Usuario.update({ cedula: cedula, nombre: nombre, apellido: apellido, segundo_apellido: segundo_apellido }, { where: { cedula: req.params.cedula } });
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

  static verifyToken(req, res) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      let token = bearer[1];
      try {
        let decoded = jwt.verify(token, process.env.KEY, { algorithm: 'HS512' });
        res.json({
          success: true,
          token: decoded
        });
      } catch (err) {
        res.json({
          success: false,
          msg: "Token corrupto."
        });
      }
    } else {
      res.json({
        success: false,
        msg: "No ha iniciado sesión."
      });
    }
  }

  static async roles(req, res) {
    try {
      db.sequelize.transaction(async t => {
        const roles = await db.Usuario_Permiso.findAll({ attributes: ['id_permiso'], where: { cedula: req.params.cedula } });
        if (roles.length > 0) {
          res.json({
            success: true,
            roles: roles
          });
        } else {
          res.json({
            success: false,
            msg: 'No tiene permisos asociados.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async verifyPassword(req, res) {
    const { cedula, clave } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        const user = await db.Usuario.findOne({ where: { cedula: cedula } });
        if (user) {
          const match = await bcrypt.compare(clave, user.clave);
          if (match) {
            res.json({
              success: true
            });
          } else {
            res.json({
              success: false,
              msg: 'Credenciales Incorrectos.'
            });
          }
        } else {
          res.json({
            success: false,
            msg: 'Usuario no existe.'
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async updateAttendantType(req, res) {
    const { id_tipo_convocado } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Usuario.update({ id_tipo_convocado: id_tipo_convocado }, { where: { cedula: req.params.cedula } });
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

module.exports = UserController;
