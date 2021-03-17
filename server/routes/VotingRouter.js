const { Router } = require('express');
const VotingController = require('../controllers/VotingController');

const router = Router();

router.post('/', VotingController.store);
router.put('/', VotingController.update);

module.exports = router;