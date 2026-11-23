const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', verifyToken, documentsController.getUserDocuments);
router.get('/vehicle/:vehicleId', verifyToken, documentsController.getVehicleDocuments);
router.post('/upload', verifyToken, upload.any(), documentsController.uploadDocument);
router.delete('/:id', verifyToken, documentsController.deleteDocument);

module.exports = router;
