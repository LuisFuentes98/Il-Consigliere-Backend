const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();

router.get('/', UserController.getUsers.bind(UserController));
router.post('/', UserController.store.bind(UserController));
router.post('/solicitar_acceso', UserController.solicitarAcceso.bind(UserController));
router.post('/enviar_link', UserController.sendLink.bind(UserController));
router.post('/inicio_sesion', UserController.authenticate.bind(UserController));
router.post('/verificar_token', UserController.verifyToken.bind(UserController));
router.post('/verificar_clave', UserController.verifyPassword.bind(UserController));
router.post('/cambiar_clave', UserController.changePassword.bind(UserController));
router.post('/nueva_clave', UserController.passwordReset.bind(UserController));
router.get('/permisos/:cedula', UserController.roles.bind(UserController));
router.get('/validar_recuperacion/:token', UserController.verifyRecovery.bind(UserController));
router.get('/validar_link/:token', UserController.verifyLink.bind(UserController));
router.put('/convocado/:cedula', UserController.updateAttendantType.bind(UserController));
router.get('/:cedula', UserController.getUser.bind(UserController));
router.put('/:cedula', UserController.update.bind(UserController));
router.delete('/:cedula', UserController.remove.bind(UserController));

module.exports = router;
