import { Router } from "express";
const router = Router();
import * as rc from "./reminder.controller.js";
import { asyncHandler } from "../../utils/errorhandling.js";
// import { multerCloudFunction } from '../../services/multerCloud.js'
// import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { isAuth } from "../../middlewares/auth.js";



router.post(
  "/",
  isAuth(),
  //validationCoreFunction(createReminderSchema),
  asyncHandler(rc.createReminder)
);

router.post(
  "/search",
  isAuth(),
  //validationCoreFunction(createReminderSchema),
  asyncHandler(rc.searchReminders)
);
router.get(
  "/adherenceReport",
  isAuth(),
  asyncHandler(rc.medicationAdherenceReport)
);

router.get(
  "/whichRemind",
  isAuth(),
  asyncHandler(rc.determineReminderMedicines)
);
router.delete(
  "/",
  isAuth(),
  // validationCoreFunction(deleteCouponSchema),
  asyncHandler(rc.deleteReminder)
);
router.post("/update", isAuth(), asyncHandler(rc.updateReminder));
router.get("/", isAuth(), asyncHandler(rc.getAllReminders));

  

export default router;
//determineReminderMedicines