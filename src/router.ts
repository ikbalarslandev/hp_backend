import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
} from "./handlers/property";
import {
  createProvince,
  getProvincebycity,
  getAllProvinces,
} from "./handlers/province";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:id", getPropertyById);
router.post("/property", createProperty);

router.post("/province", createProvince);
router.get("/province/:city", getProvincebycity);
router.get("/province", getAllProvinces);

export default router;
