const { Router } = require('express');
const DiscussionTypeController = require('../controllers/DiscussionTypeController');

const router = Router();

router.get('/', DiscussionTypeController.getDiscussionTypes);

module.exports = router;