const { Router } = require('express');
const AttendantTypeController = require('../controllers/AttendantTypeController');

const router = Router();

router.get('/', AttendantTypeController.getAttendantTypes);

module.exports = router;