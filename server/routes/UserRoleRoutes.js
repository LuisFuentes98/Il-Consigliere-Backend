const { Router } = require('express');
const UserRoleController = require('../controllers/UserRoleController');

const router = Router();

router.post('/', UserRoleController.store);
router.delete('/:cedula', UserRoleController.remove)

module.exports = router;