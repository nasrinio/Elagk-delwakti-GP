//import slugify from 'slugify'
// import cloudinary from '../../utils/coludinaryConfigrations.js'
// import { customAlphabet } from 'nanoid'
import { medicineModel } from "../../../DB/Models/medicine.model.js";
import { medicineCategoryModel } from "../../../DB/Models/medicineCategory.js";
// const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

//=================================== Add medicine ========================
export const addMedicine = async (req, res, next) => {
  const {
    medicineName,
    prescriptionRequired,
    storageCondition,
    expiryDate,
    usageInstruction,
    sideEffects,
    activeIngredient,
    medicineType,
    manufacture,
    concentration,
  } = req.body;
  const { categoryId } = req.query;
  // check categories

  const categoryExists = await medicineCategoryModel.findById(categoryId);

  if (!categoryExists) {
    return next(new Error("invalid categories", { cause: 400 }));
  }

  // db
  const medicineObject = {
    medicineName,
    prescriptionRequired,
    storageCondition,
    expiryDate,
    usageInstruction,
    sideEffects,
    activeIngredient,
    manufacture,
    medicineType,
    concentration,
    categoryId,
  };
  const dbMedicine = await medicineModel.create(medicineObject);
  if (!dbMedicine) {
    //     await cloudinary.uploader.destroy(public_id)
    return next(new Error("try again later", { cause: 400 }));
  }
  res.status(201).json({ message: "CreatedDone", dbMedicine });
};

//======================== searchMedicineByName =======================
export const searchMedicineByName = async (req, res, next) => {
  try {
    const { medicineName } = req.body;

    // Perform a case-insensitive search for medicine by name using a regular expression
    const medicines = await medicineModel.find({
      medicineName: { $regex: new RegExp(medicineName, 'i') },
    });

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({ message: "No medicine found" });
    }

    res.status(200).json({ message: "Medicine found", medicines });
  } catch (error) {
    console.error("Error searching medicine by name:", error);
    next(new Error("Failed to search for medicine", { cause: 500 }));
  }
};

//======================== getAllMedicines =======================
export const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await medicineModel.find();
    res.status(200).json({ message: "Medicines found", medicines });
  } catch (error) {
    console.error("Error getting all medicines:", error);
    next(new Error("Failed to get all medicines", { cause: 500 }));
  }
}
