import { Router } from "express";
import { multerCloudFunction } from "../../services/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { asyncHandler } from "../../utils/errorhandling.js";
import * as pc from "./prescription.controller.js";
import { isAuth } from "../../middlewares/auth.js";
// import { validationCoreFunction } from '../../middlewares/validation.js'
// import * as validators from './category.validationSchemas.js'

const router = Router();

router.post(
  "/",
  isAuth(),
  multerCloudFunction(allowedExtensions.Image).single("image"),

  asyncHandler(pc.createPrescription)
);
router.get(
  "/getAllMedicineNames",
  isAuth(),
  asyncHandler(pc.getAllMedicineNames)
);

router.get("/", isAuth(), asyncHandler(pc.getAllPrescriptions));

// import { Router } from 'express'
// import * as sc from './subCategory.controller.js'
// import { multerCloudFunction } from '../../services/multerCloud.js'
// import { allowedExtensions } from '../../utils/allowedExtensions.js'
// import { asyncHandler } from '../../utils/errorhandling.js'
// import * as validators from './subCategory.validationSchemas.js'
// import { validationCoreFunction } from '../../middlewares/validation.js'

// const router = Router({ mergeParams: true })

// router.post(
//   '/',
//   multerCloudFunction(allowedExtensions.Image).single('image'),
//   validationCoreFunction(validators.createSubCategorySchema),
//   asyncHandler(sc.createSubCategory),
// )

// router.get('/', asyncHandler(sc.getAllSubCategories))

export default router;

// //  /category/:categoryId  => subCategoryRouter
