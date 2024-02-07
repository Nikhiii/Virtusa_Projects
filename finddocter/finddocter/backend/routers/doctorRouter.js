const express = require('express');
const doctorContoller = require('../controllers/doctorController');
const {validateToken} = require('../authUtils');
const router = express.Router();

router.post('/addDoctor',validateToken, doctorContoller.addDoctor);
router.post('/getAllDoctors',validateToken, doctorContoller.getAllDoctors);
router.put('/updateDoctor/:id',validateToken, doctorContoller.updateDoctor);
router.delete('/deleteDoctor/:id',validateToken, doctorContoller.deleteDoctor);
router.get('/getDoctorById/:id',validateToken, doctorContoller.getDoctorById);
router.post('/getDoctorByUserId',validateToken, doctorContoller.getDoctorByUserId);

module.exports = router;