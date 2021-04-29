const { Router } = require('express');
const DiscussionController = require('../controllers/DiscussionController');

const router = Router();

router.post('/', DiscussionController.store);
router.get('/getFiles/:consecutivo/:idpunto', DiscussionController.getDiscussionFiles);
router.post('/upload', DiscussionController.uploadFile);
router.post('/getURL', DiscussionController.downloadFile);
router.get('/aprobado/:consecutivo', DiscussionController.getDiscussions);
router.get('/votacion/:consecutivo', DiscussionController.getVotingDiscussions);
router.get('/solicitud/:consecutivo', DiscussionController.getRequests);
router.get('/solicitud/:cedula/:consecutivo', DiscussionController.getRequestsByUser);
router.put('/ordenar/', DiscussionController.updateOrder);
router.put('/:id_punto', DiscussionController.updateDiscussionsState);
router.delete('/por_consejo/:consecutivo', DiscussionController.removeByCouncil);
router.delete('/:id_punto', DiscussionController.remove);

module.exports = router;