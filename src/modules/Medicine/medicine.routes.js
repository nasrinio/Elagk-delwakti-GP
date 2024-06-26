import { Router } from "express";
const router = Router();
import * as mc from "./medicine.controller.js";
import { asyncHandler } from "../../utils/errorhandling.js";
// import { multerCloudFunction } from '../../services/multerCloud.js'
// import { allowedExtensions } from '../../utils/allowedExtensions.js'

// // TODO: api validation
router.post(
  "/",
  //multerCloudFunction(allowedExtensions.Image).single('logo'),
  asyncHandler(mc.addMedicine)
);
router.post("/search", asyncHandler(mc.searchMedicineByName));
router.post("/medicineAlternatives", asyncHandler(mc.getMedicineAlternatives));

router.get("/", asyncHandler(mc.getAllMedicines));

export default router;
