const express = require('express');
const medicineContoller = require('../controllers/medicineController');
const {validateToken} = require('../authUtils');
const router = express.Router();

router.post('/addMedicine',validateToken, medicineContoller.addMedicine);
router.post('/getAllMedicines',validateToken, medicineContoller.getAllMedicines);
router.put('/updateMedicine/:id',validateToken, medicineContoller.updateMedicine);
router.delete('/deleteMedicine/:id',validateToken, medicineContoller.deleteMedicine);
router.get('/getMedicineById/:id',validateToken, medicineContoller.getMedicineById);
router.post('/getMedicineByUserId',validateToken, medicineContoller.getMedicineByUserId);

module.exports = router;