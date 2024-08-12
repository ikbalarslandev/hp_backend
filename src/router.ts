import { Router } from "express";
import {
  getAllProperties,
  getPropertyByTitle,
  createProperty,
} from "./handlers/property";
import { createReview, isExist } from "./handlers/review";
import { createUser } from "./handlers/user";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:title", getPropertyByTitle);
router.post("/property", createProperty);

router.post("/review", createReview);
router.get("/review", isExist);

router.post("/user", createUser);

export default router;
