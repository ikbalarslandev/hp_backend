import { Router } from "express";
import {
  getAllProperties,
  getPropertyByTitle,
  createProperty,
} from "./handlers/property";
import { createReview, isExist } from "./handlers/review";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:title", getPropertyByTitle);
router.post("/property", createProperty);

router.post("/review", createReview);
router.get("/review", isExist);

export default router;
