import { Router } from "express";
import prisma from "./db";

const router = Router();

router.get("/property", async (req, res) => {
  const properties = await prisma.property.findMany();
  const filters = req.query;

  const filteredProperties = properties.filter((property) => {
    return Object.keys(filters).every((filter) => {
      return property[filter] === filters[filter];
    });
  });

  return res.json(filteredProperties);
});
router.get("/property/:id", (req, res) => {});
router.put("/property/:id", (req, res) => {});
router.post("/property", (req, res) => {});
router.delete("/property/:id", (req, res) => {});

export default router;
