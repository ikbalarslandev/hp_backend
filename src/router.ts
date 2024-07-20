import { Router } from "express";
import prisma from "./db";

const router = Router();

router.get("/property", async (req, res) => {
  const { page, limit, ...filters } = req.query;

  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 2;

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  const properties = await prisma.property.findMany();

  const filteredProperties = properties.filter((property) => {
    return Object.keys(filters).every((filter) => {
      return property[filter] === filters[filter];
    });
  });

  const data = filteredProperties.slice(startIndex, endIndex);

  const result = {
    all_items: filteredProperties.length,
    page: pageNumber,
    max_page: Math.ceil(filteredProperties.length / limitNumber),
    limit: limitNumber,
    data,
  };
  return res.json(result);
});

router.get("/property/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    return res.json(property);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Property not found or an error occurred" });
  }
});

router.put("/property/:id", (req, res) => {});
router.post("/property", (req, res) => {});
router.delete("/property/:id", (req, res) => {});

export default router;
