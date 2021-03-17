const { Router } = require('express');
const EmailController = require('../controllers/EmailController');

const router = Router();

router.delete('/', EmailController.remove);
router.post('/verificar_correo', EmailController.isEmailTaken);
router.post('/:cedula', EmailController.store);
router.get('/:cedula', EmailController.getEmails);
router.delete('/:cedula', EmailController.removeById);

module.exports = router;