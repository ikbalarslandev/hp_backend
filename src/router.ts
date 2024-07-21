import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
} from "./handlers/property";

const router = Router();

router.get("/property", getAllProperties);
router.get("/property/:id", getPropertyById);
router.post("/property", createProperty);

export default router;
