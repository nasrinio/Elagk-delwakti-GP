import { governateModel } from "../../../DB/Models/governate.js"


 // ========================================== create governate ==========================================
export const createGovernate = async (req, res, next) => {
//   const { _id } = req.authUser
const { name } = req.body


if (await governateModel.findOne({ name })) {
     return next(
      new Error('please enter different governate name', { cause: 400 }),
    )
   }
   const governateObject = {name}

  const governate = await governateModel.create(governateObject)
  if (!governate) {
    return next(
      new Error('try again later , fail to add governate', { cause: 400 }),
    )
  }

  res.status(200).json({ message: 'Added Done', governate })
}

//======================= getAllGovernates =============
export const getAllGovernates = async (req, res, next) => {
  try {
    const governates = await governateModel.find();
    if (!governates) {
      return next(new Error("cities not found", { cause: 404 }));
    }
    res.status(200).json({ governates });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
