const { Router } = require('express');
const RoleController = require('../controllers/RoleController');

const router = Router();

router.get('/', RoleController.getRoles);
router.post('/', RoleController.store);
router.delete('/:id', RoleController.remove);

module.exports = router;