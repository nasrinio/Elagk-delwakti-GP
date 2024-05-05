// import slugify from 'slugify'
import cloudinary from "../../utils/coludinaryConfigrations.js";
import { userModel } from "../../../DB/Models/user.model.js";
import { prescriptionModel } from "../../../DB/Models/prescription.js";
import { medicineModel } from "../../../DB/Models/medicine.model.js";
import { performOCR } from "../../utils/tesseract.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);

//============================= create prescription =============================================
export const createPrescription = async (req, res, next) => {
  const { medicineId } = req.query;
  const { createDate, title } = req.body;
  const patientId = req.authUser._id;

  const patient = await userModel.findById(patientId);
  if (!patient) return next(new Error("Invalid patient", { cause: 400 }));

  const medicine = await medicineModel.findById(medicineId);
  if (!medicine) return next(new Error("Invalid medicine", { cause: 400 }));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.PROJECT_FOLDER}/Prescriptions/${nanoid()}` }
  );

  const text = await performOCR(secure_url);
  if (!text) {
    text = "failed to extract text";
    // return next(new Error("Failed to perform OCR", { cause: 402 }));
  }
  const prescription = await prescriptionModel.create({
    createDate,
    patientId,
    image: { secure_url, public_id },
    title,
    prescriptionText: text,
    medicineId,
  });
  if (!prescription) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Failed to create prescription", { cause: 402 }));
  }
  res.status(200).json({ message: "Added Done", prescription });
};

//============================= delete prescription =============================================
export const deletePrescription = async (req, res, next) => {
  const { prescriptionId } = req.query;
  const userId = req.authUser._id;

  // Find the prescription by its ID
  const prescription = await prescriptionModel.findById(prescriptionId);

  // Check if the prescription exists
  if (!prescription) {
    return res.status(404).json({ message: "Prescription not found" });
  }

  // Check if the prescription belongs to the logged-in user
  if (prescription.patientId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this prescription" });
  }

  // Delete the prescription
  await prescriptionModel.findByIdAndRemove(prescriptionId);

  res.status(200).json({ message: "Prescription deleted successfully" });
};

//============================= get all prescription =============================================
export const getAllPrescriptions = async (req, res, next) => {
  // Retrieve the logged-in user's ID
  const userId = req.authUser._id;

  try {
    // Find all prescriptions associated with the user and populate the patientId attribute
    const prescriptions = await prescriptionModel
      .find({ patientId: userId })
      .populate("patientId");

    // Return the populated prescriptions
    res.status(200).json({ message: "Success", prescriptions });
  } catch (error) {
    // Handle errors
    next(error);
  }
};

//=============================== get all medicine names in prescription ===============================
export const getAllMedicineNames = async (req, res, next) => {
  const userId = req.authUser._id;

  const prescriptions = await prescriptionModel
    .find({ patientId: userId })
    .populate("medicineId");

  const medicineInfo = prescriptions
    .map((prescription) => {
      return prescription.medicineId.map((medicine) => ({
        medicineId: medicine._id,
        medicineName: medicine.medicineName,
      }));
    })
    .flat();

  res.status(200).json({ message: "Success", medicineInfo });
};

export const prescriptionRequiredMedicines = async (req, res, next) => {
  const userId = req.authUser._id;

  try {
    // Find all prescriptions for the given user ID
    const prescriptions = await prescriptionModel.find({ patientId: userId });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for the user." });
    }

    // Initialize an array to store medicines with prescriptionRequired = true
    const prescriptionRequiredMedicines = [];

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Find the medicine details for each medicine in the prescription
      for (const medicineId of prescription.medicineId) {
        const medicine = await medicineModel.findById(medicineId);

        if (medicine && medicine.prescriptionRequired) {
          // Add the medicine data to the prescriptionRequiredMedicines array
          prescriptionRequiredMedicines.push({
            medicineId: medicine._id,
            medicineName: medicine.medicineName,
            activeIngredient: medicine.activeIngredient,
            usageInstruction: medicine.usageInstruction,
            concentration: medicine.concentration,
            sideEffects: medicine.sideEffects,
          });
        }
      }
    }

    res.status(200).json({
      message: "Medicines with prescriptionRequired flag",
      prescriptionRequiredMedicines,
    });
  } catch (error) {
    console.error("Error getting prescriptionRequired medicines:", error);
    next(new Error("Failed to get prescriptionRequired medicines"));
  }
};
