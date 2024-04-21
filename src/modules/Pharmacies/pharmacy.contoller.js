// import slugify from 'slugify'
import cloudinary from "../../utils/coludinaryConfigrations.js";
import { customAlphabet } from "nanoid";
import { pharmacyModel } from "../../../DB/Models/pharmacy.model.js";
import { medicineModel } from "../../../DB/Models/medicine.model.js";
import { cityModel } from "../../../DB/Models/city.js";

const nanoid = customAlphabet("123456_=!ascbhdtel", 5); 

// ========================================== create Pharmacy ==========================================

export const createPharmacy = async (req, res, next) => {
  const {
    pharmacyName,
    unitPrice,
    phoneNumber,
    operatingHours,
    streetName,
    buildingNum,
  } = req.body;
  const { medicineId, cityId } = req.query;
  // check medicineId and cityId
  const medicineExists = await medicineModel.findById(medicineId);
  const cityExists = await cityModel.findById(cityId);

  if (!medicineExists) {
    return next(new Error("invalid medicine", { cause: 400 }));
  }
  if (!cityExists) {
    return next(new Error("invalid city", { cause: 400 }));
  }
  // slug
  //   const slug = slugify(name, {
  //     replacement: "",
  //     lower: true,
  //   });

  //logo
  if (!req.file) {
    return next(new Error("please upload your logo", { cause: 400 }));
  }
  const customId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Pharmacies/${pharmacyName + customId}`,
    }
  );
  // !db
  const pharmacyObject = {
    pharmacyName,
    unitPrice,
    phoneNumber,
    operatingHours,
    streetName,
    buildingNum,
    //slug,
    logo: { secure_url, public_id },
    medicineId,
    cityId,
    customId,
  };
  const pharmacy = await pharmacyModel.create(pharmacyObject);
  if (!pharmacy) {
    await cloudinary.uploader.destroy(public_id);
    return next(
      new Error("try again later , fail to add your pharmacy", { cause: 400 })
    );
  }

  res.status(200).json({ message: "Added Done", pharmacy });
};




// =====================find Pharmacies By Medicine And City ==========================================

export const findPharmacies = async (req, res) => {
    const { medicineName, cityName } = req.body;

    // Find the city ID based on the provided city name
    const city = await cityModel.findOne({ name: cityName });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Find the medicine ID based on the provided medicine name
    const medicine = await medicineModel.findOne({ medicineName });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Find pharmacies with the given medicine ID and city ID
    const pharmacies = await pharmacyModel.find({
      medicineId: medicine._id,
      cityId: city._id,
    });
    if (!pharmacies) {
      return res.status(404).json({ message: "Pharmacies not found" });
    }
    res.status(200).json({ message: " pharmacies found", pharmacies });
  } 


//================== getAllPharmacies =======================================
export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await pharmacyModel.find().populate("cityId", "name");
    res.status(200).json({ pharmacies });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



