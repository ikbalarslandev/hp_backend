import { Router } from "express";
import {
  getAllProperties,
  getPropertyByTitle,
  createProperty,
} from "./handlers/property";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:title", getPropertyByTitle);
router.post("/property", createProperty);

export default router;
