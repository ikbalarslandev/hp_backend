import { Router } from "express";
import {
  getAllProperties,
  getPropertyByTitle,
  createProperty,
} from "./handlers/property";
import {
  createReview,
  isExist,
  getReviewsForProperty,
} from "./handlers/review";
import { createUser, getUserByEmail } from "./handlers/user";
import {
  getCountries,
  getCountryByTld,
  createCountry,
} from "./handlers/country";

const router: Router = Router();

router.get("/property", getAllProperties);
router.get("/property/:title", getPropertyByTitle);
router.post("/property", createProperty);

router.post("/review", createReview);
router.get("/review", isExist);
router.get("/review/:propertyId", getReviewsForProperty);

router.post("/user", createUser);
router.get("/user/:email", getUserByEmail);

router.get("/country", getCountries);
router.get("/country/:tld", getCountryByTld);
router.post("/country", createCountry);

export default router;
