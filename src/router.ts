import { Router } from "express";
import {
  getAllProperties,
  getPropertyByTitle,
  createProperty,
  createReview,
} from "./handlers/property";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:title", getPropertyByTitle);
router.post("/property", createProperty);

router.post("/review", createReview);

export default router;
