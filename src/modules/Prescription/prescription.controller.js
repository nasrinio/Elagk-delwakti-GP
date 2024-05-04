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
// ================= Prescription Required Medicines =================

// export const prescriptionRequiredMedicines = async (req, res, next) => {
//   try {
//     const userId = req.authUser._id;

//     // Find all prescriptions for the given user ID
//     const prescriptions = await prescriptionModel.find({ patientId: userId });

//     if (!prescriptions || prescriptions.length === 0) {
//       return res.status(404).json({ message: "No prescriptions found for the user" });
//     }

//     // Initialize an array to store prescription IDs with prescriptionRequired flag
//     const prescriptionIds = [];

//     // Initialize an array to store unique medicine names
//     const uniqueMedicineNames = [];

//     // Loop through each prescription
//     for (const prescription of prescriptions) {
//       // Find the medicine details for the prescription
//       const medicine = await medicineModel.findById(prescription.medicineId);

//       if (medicine && medicine.prescriptionRequired) {
//         // Add prescription ID to the array if prescriptionRequired is true
//         prescriptionIds.push(prescription._id);

//         // Add unique medicine names to the array
//         if (!uniqueMedicineNames.includes(medicine.medicineName)) {
//           uniqueMedicineNames.push(medicine.medicineName);
//         }
//       }
//     }

//     res.status(200).json({ message: "Prescription IDs with prescriptionRequired flag", prescriptionIds, uniqueMedicineNames });
//   } catch (error) {
//     console.error("Error detecting prescriptionRequired medicines:", error);
//     next(new Error("Failed to detect prescriptionRequired medicines", { cause: 500 }));
//   }
// };


export const prescriptionRequiredMedicines = async (req, res, next) => {
  try {
    const userId = req.authUser._id;

    // Find all prescriptions for the given user ID
    const prescriptions = await prescriptionModel.find({ patientId: userId });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for the user" });
    }

    // Initialize an array to store prescription IDs with prescriptionRequired flag
    const prescriptionIds = [];

    // Initialize an array to store unique medicine names with prescriptionRequired = true
    const medicineArr = [];

    // Loop through each prescription
    for (const prescription of prescriptions) {
      // Find the medicine details for the prescription
      const medicine = await medicineModel.findById(prescription.medicineId);

      if (medicine && medicine.prescriptionRequired) {
        // Add prescription ID to the array if prescriptionRequired is true
        prescriptionIds.push(prescription._id);

        // Check if the medicine name is already in the Medicines array
        const existingMedicineIndex = medicineArr.findIndex(
          (item) => item.medicineName === medicine.medicineName
        );

        if (existingMedicineIndex === -1) {
          // Add the medicine data to the Medicines array
          medicineArr.push({
            medicineName: medicine.medicineName,
            prescriptionRequired : medicine.prescriptionRequired,
            activeIngredient : medicine.activeIngredient,
            usageInstruction : medicine.usageInstruction, 
            concentration : medicine.concentration,
            sideEffects : medicine.sideEffects
          });
        }
      }
    }

    res.status(200).json({ message: "Prescription IDs with prescriptionRequired flag", prescriptionIds, medicineArr });
  } catch (error) {
    console.error("Error detecting prescriptionRequired medicines:", error);
    next(new Error("Failed to detect prescriptionRequired medicines", { cause: 500 }));
  }
};
