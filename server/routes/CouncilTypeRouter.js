const { Router } = require('express');
const CouncilTypeController = require('../controllers/CouncilTypeController');

const router = Router();

router.get('/', CouncilTypeController.getCouncilTypes);

module.exports = router;