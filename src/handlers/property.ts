import { PrismaClient } from "@prisma/client";
import prisma from "../db";

const getAllProperties = async (req, res) => {
  const { page, limit, ...filters } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 2;

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  const properties = await prisma.property.findMany();

  const filteredProperties = properties.filter((property) => {
    return Object.keys(filters).every((filter) => {
      return property[filter] === filters[filter];
    });
  });

  const data: any = filteredProperties.slice(startIndex, endIndex);

  const propertiesWithDetails = await Promise.all(
    data.map(async (property) => {
      const contactInfo = await prisma.contact.findUnique({
        where: {
          id: property.contactId,
        },
      });
      const priceInfo = await prisma.price.findUnique({
        where: {
          id: property.priceId,
        },
      });
      property.contact = contactInfo;
      property.price = priceInfo;
      // Remove contactId and priceId from the property object
      delete property.contactId;
      delete property.priceId;
      return property;
    })
  );

  const result = {
    all_items: filteredProperties.length,
    page: pageNumber,
    max_page: Math.ceil(filteredProperties.length / limitNumber),
    limit: limitNumber,
    data: propertiesWithDetails,
  };

  return res.json(result);
};

const getPropertyById = async (req, res) => {
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
};

const createProperty = async (req, res) => {
  const { title, vibe, amenities, photos, days, contact, price } = req.body;

  try {
    const property = await prisma.property.create({
      data: {
        title,
        vibe,
        amenities,
        photos,
        days: {
          create: days,
        },
        contact: {
          create: contact, // Create related Contact record
        },
        price: {
          create: price, // Create related Price record
        },
      },
    });

    return res.json(property);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: error.message });
  }
};

export { getAllProperties, getPropertyById, createProperty };
