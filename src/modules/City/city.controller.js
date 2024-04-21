import { cityModel } from "../../../DB/Models/city.js";
import { governateModel } from "../../../DB/Models/governate.js";

// ========================================== add city ==========================================
export const createCity = async (req, res, next) => {
  const { governateId } = req.query;
  const { name } = req.body;

  if (await cityModel.findOne({ name })) {
    return next(
      new Error("please enter different governate name", { cause: 400 })
    );
  }
  const cityObject = { name, governateId };

  const city = await cityModel.create(cityObject);
  if (!city) {
    return next(
      new Error("try again later , fail to add City", { cause: 400 })
    );
  }

  res.status(200).json({ message: "Added Done", city });
};

//=========================================== get all cities ==========================================
export const getAllCities = async (req, res, next) => {
  try {
    const cities = await cityModel.find();
    if (!cities) {
      return next(new Error("cities not found", { cause: 404 }));
    }
    res.status(200).json({ cities });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//====================================getCitiesByGovernateName======================================
export const getCitiesByGovernateName = async (req, res, next) => {
  try {
    const { governateName } = req.body;
    // Find the governate based on the provided name
    const governate = await governateModel.findOne({ name: governateName });

    if (!governate) {
      return res.status(404).json({ message: "Governate not found" });
    }

    // Find all cities associated with the found governate
    const cities = await cityModel.find({ governateId: governate._id });

    if (!cities || cities.length === 0) {
      return res
        .status(404)
        .json({ message: "No cities found for this governate" });
    }

    res.status(200).json({ cities });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
