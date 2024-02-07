const Medicine = require('../models/medicineModel');

const addMedicine = async (req, res) => {
  try {
    await Medicine.create(req.body);
    res.status(200).json({ "message": "Medicine added Successfully" });
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ message: error.message });
  }
}

const getAllMedicines = async (req, res) => {
  try {
    const sortValue = req.body.sortValue || 1;
    const search = req.body.searchValue || '';
    
    const searchRegex = new RegExp(search, 'i');
    const medicines = await Medicine.find({product : searchRegex})
     .sort({price : parseInt(sortValue)});
     console.log("medicines",medicines);
    res.status(200).json({medicines});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateMedicine = async (req, res) => {
   try{
    const { id } = req.params;
    const medicine = await Medicine.findByIdAndUpdate(id, req.body , {new : true});
    if(!medicine){
        return res.status(404).json({"message" : "Medicine not found"});
        }
    res.status(200).json({ "message": "Medicine Updated Successfully" });
   } catch (error) {
    res.status(500).json({ message: error.message });
}
};

const deleteMedicine = async (req, res) => {
  try{

    const { id } = req.params;
    const medicine = await Medicine.findByIdAndDelete(id);
    if(!medicine){
        return res.status(404).json({"message" : "Medicine not found"});
        }
    res.status(200).json({ "message": "Medicine Deleted Successfully" });
   } catch (error) {
    res.status(500).json({ message: error.message });
}
};

const getMedicineById = async (req, res) => {
  try{

    const { id } = req.params;
    const medicine = await Medicine.findById(id);
    if(!medicine){
        return res.status(404).json({"message" : "Medicine not found"});
        }
    res.status(200).json(medicine);
   } catch (error) {
    res.status(500).json({ message: error.message });
}
};

const getMedicineByUserId = async (req, res) => {
try 
{
  const sortValue = req.body.sortValue || 1;
  const search = req.body.searchValue || '';
  const searchRegex = new RegExp(search, 'i');
  const { userId } = req.body;
  const medicine = await Medicine.find({userId, product : searchRegex})
  .sort({price : parseInt(sortValue)});
  if(medicine.length === 0 ){
    return res.status(404).json({"message" : "Medicine not found"});
    }
  res.status(200).json(medicine);
} catch (error) {
  console.log("error",error.message);
  res.status(500).json({ message: error.message});
}
};


module.exports = {
  addMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
  getMedicineById,
  getMedicineByUserId
};

