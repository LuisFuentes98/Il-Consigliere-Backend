const db = require('../../database/models');
const {storage} = require('../middleware/GcloudConfig');
var multer = require('multer')
var upload = multer().array('archivos')
//const fs = require('fs');
const fs = require('fs-extra');
const e = require('express');

class DiscussionController {

  static async getDiscussions(req, res) {
    try {
      await db.sequelize.transaction(async t => {
        const discussions = await db.Punto.findAll({ attributes: ['id_punto', 'asunto', 'orden', 'id_tipo_punto', 'comentario'], where: { consecutivo: req.params.consecutivo, id_estado_punto: 1 }, order: [['orden', 'ASC']] });
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
        const discussions = await db.sequelize.query(`SELECT "Punto"."id_punto", "Punto"."asunto", "Punto"."comentario", "Punto"."id_tipo_punto", "Usuario"."nombre", "Usuario"."apellido" FROM public."Punto" INNER JOIN public."Usuario" ON "Punto"."cedula" = "Usuario"."cedula" WHERE "Punto"."consecutivo" = '${req.params.consecutivo}' AND "Punto"."id_estado_punto" = 2`);
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
        const discussions = await db.Punto.findAll({ attributes: ['id_punto', 'asunto', 'comentario', 'id_tipo_punto'], where: { consecutivo: req.params.consecutivo, cedula: req.params.cedula, id_estado_punto: 2 } });
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
        const discussions = await db.sequelize.query(`SELECT "Punto"."id_punto", "Punto"."asunto", "Punto"."comentario", "Punto"."id_tipo_punto", "Votacion"."favor", "Votacion"."contra", "Votacion"."abstencion" FROM public."Punto" LEFT JOIN public."Votacion" ON "Punto"."id_punto" = "Votacion"."id_punto" WHERE "Punto"."consecutivo" = '${req.params.consecutivo}' AND "Punto"."id_estado_punto" = 1 ORDER BY "Punto"."orden"`);
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
    const { consecutivo, asunto, comentario, orden, cedula, id_estado_punto, id_tipo_punto } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.create({
          consecutivo: consecutivo, asunto: asunto, comentario: comentario, id_estado_punto: id_estado_punto,
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

  static async update(req, res) {
    const {asunto, comentario, id_tipo_punto} = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.update({
          asunto: asunto,
          comentario: comentario,
          id_tipo_punto: id_tipo_punto
        }, { where: { id_punto: req.params.id_punto } });
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
    const { id_estado_punto, asunto, comentario, orden } = req.body;
    try {
      await db.sequelize.transaction(async t => {
        await db.Punto.update({ id_estado_punto: id_estado_punto, asunto: asunto, comentario: comentario, orden: orden }, { where: { id_punto: req.params.id_punto } });
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

  //GOOGLE CLOUD SERVICES FILE MANAGEMENT
  /*
  static async getDiscussionFiles(req, res) {
    try {
      let bucketName = 'il-consigliere-files';
      let bucket = storage.bucket(bucketName);
      let fileList = [];
      const [files] = await bucket.getFiles({ prefix: `${req.params.consecutivo}/${req.params.idpunto}`});
      files.forEach(file => {
        fileList.push({
          filename: file.name,
          type: file.metadata.contentType,
        });
      });
      res.json({
        success: true,
        msg: "success",
        files: fileList
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor.'
      });
    }
  }

  static async uploadFile(req, res, next) {
    try {
      async function uploadFile(file, folder) {
        let bucketName = 'il-consigliere-files'
        let bucket = storage.bucket(bucketName)
        let newFilename = folder.replace(/ /g,"_") + '/' + Date.now() + '-' + file.originalname;
        let fileUpload = bucket.file(newFilename);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        });

        blobStream.on('error', (error) => {
          console.log('File upload Error: ' + error);
        });

        blobStream.on('finish', () => {
          const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        });

        blobStream.end(file.buffer);
      }
      upload(req, res, function (err) {
        let files = req.files

        for (let file in files) {
          uploadFile(files[file], req.body.folder)
        }

        if (err) {
          return res.end("Error uploading file." + err);
        }
        res.end("File is uploaded");
      });
    } catch (err) {
      res.json({ "err": err });
    }
  }

  static async deletefile(req, res){
    try {
      let bucketName = 'il-consigliere-files';
      let bucket = storage.bucket(bucketName);
      let filename = `${req.params.consecutivo}/${req.params.idpunto}/${req.params.filename}`;
      await bucket.file(filename).delete()
      .then(() => {
        res.json({
          success: true,
          msg: "File deleted successfully",
        });
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Error interno del servidor: '+ err
      });
    }
  }
  */

  //LOCAL FILE MANAGEMENT

  static async getDiscussionFiles(req, res) {
    try {
      var filepath = `server/dataStorage/Consejos/${req.params.consecutivo}/${req.params.idpunto}`;
      fs.ensureDirSync(filepath);
      fs.readdir(filepath, (err, files) => {
        if(err){
          console.log(err);
          res.status(500).json({
            success: false,
            msg: err
          });
        }else{
          let fileList = []
          files.forEach(file => {
            console.log(file);
            fileList.push({
              filename: file,
              type: 'txt',
            });
          });
          res.json({
            success: true,
            files: fileList
          })
        }
      });
    }catch(err){
      console.log(err);
    }
  }

  static async uploadFile(req, res, next) {
    
    try {
      async function uploadFile(file, folder) {
        let newFolder = 'server/dataStorage/Consejos/'+folder.replace(/ /g,"_") + '/' + Date.now() + '-' + file.originalname;
        console.log(newFolder);
        fs.writeFile(newFolder, file.buffer, function (err) {
          if (err) throw err;
        });
      }
      upload(req, res, function (err) {
        let files = req.files
        for (let file in files) {
          uploadFile(files[file], req.body.folder)
        }
        if (err) {
          return res.end("Error uploading file." + err);
        }
        res.end("File is uploaded");
      });
    } catch (err) {
      res.json({ "err": err });
    }
    
    
    
    try {

    }catch(err){
      console.log(err);
    }
  }

  static async deletefile(req, res){
    var filepath = `server/dataStorage/Consejos/${req.params.consecutivo}/${req.params.idpunto}/${req.params.filename}`;
    console.log(filepath);
    try {
      await fs.remove(filepath)
      console.log('success!');
      res.json({
        success: true
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: err
      });
    }
  }

  static async getFile(req, res){
    var filepath = `server/dataStorage/Consejos/${req.params.consecutivo}/${req.params.idpunto}/`;
    var filename = req.params.filename;
    console.log(filepath, filename);
    try {
      res.download(filepath+filename, (err)=>{
        if(err){
          res.status(500).send({
            msg: "No se pudo descargar." + err,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: err
      });
    }
  }
}

module.exports = DiscussionController;