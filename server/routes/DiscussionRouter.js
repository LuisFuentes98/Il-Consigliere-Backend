const { Router } = require('express');
const DiscussionController = require('../controllers/DiscussionController');

const router = Router();

router.post('/', DiscussionController.store);
router.post('/modificar/:id_punto', DiscussionController.update);
router.get('/getFiles/:consecutivo/:idpunto', DiscussionController.getDiscussionFiles);
router.delete('/deleteFile/:consecutivo/:idpunto/:filename', DiscussionController.deletefile);
router.post('/upload', DiscussionController.uploadFile);
router.get('/aprobado/:consecutivo', DiscussionController.getDiscussions);
router.get('/votacion/:consecutivo', DiscussionController.getVotingDiscussions);
router.get('/solicitud/:consecutivo', DiscussionController.getRequests);
router.get('/solicitud/:cedula/:consecutivo', DiscussionController.getRequestsByUser);
router.put('/ordenar/', DiscussionController.updateOrder);
router.put('/:id_punto', DiscussionController.updateDiscussionsState);
router.delete('/por_consejo/:consecutivo', DiscussionController.removeByCouncil);
router.delete('/:id_punto', DiscussionController.remove);

module.exports = router;