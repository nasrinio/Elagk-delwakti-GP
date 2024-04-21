// import slugify from 'slugify'
import { customAlphabet } from "nanoid";
import cloudinary from "../../utils/coludinaryConfigrations.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);
import { userModel } from "../../../DB/Models/user.model.js";
import { prescriptionModel } from "../../../DB/Models/prescription.js";
import { medicineModel } from "../../../DB/Models/medicine.model.js";
import { performOCR } from "../../utils/tesseract.js";

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

// export const deletePrescription = async (req, res, next) => {
//   const { prescriptionId } = req.query;
//   try {
//     const prescription = await prescriptionModel.findByIdAndDelete(prescriptionId);
//     if (!prescription) {
//       return next(new Error("invalid prescriptionId", { cause: 400 }));
//     }
//     res.status(200).json({ message: "deleted Done", prescription });
//   } catch (error) {
//     next(error);
//   }

// }

// Assuming this is where you retrieve prescriptions for the logged-in user
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

//=============================== get all medicine names ===============================
export const getAllMedicineNames = async (req, res, next) => {
  try {
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
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
};
