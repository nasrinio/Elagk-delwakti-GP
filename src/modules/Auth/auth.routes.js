import { Router } from "express";
const router = Router();
import * as ac from "./auth.controller.js";
import { asyncHandler } from "../../utils/errorhandling.js";
import { isAuth } from "../../middlewares/auth.js";
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { multerCloudFunction } from '../../services/multerCloud.js'

router.post(
  "/",
  multerCloudFunction(allowedExtensions.Image).single("image"),
  asyncHandler(ac.signUp)
);

router.get("/confirm/:token", asyncHandler(ac.confirmEmail));
router.post("/login", asyncHandler(ac.logIn));
router.post("/forget", asyncHandler(ac.forgetPassword));
router.post("/reset/:token", asyncHandler(ac.resetPassword));
router.get("/profile", isAuth(), asyncHandler(ac.profile));
router.get("/logOut", isAuth(), asyncHandler(ac.logOut));
export default router;
