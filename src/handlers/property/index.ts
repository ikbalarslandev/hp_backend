import prisma from "../../db";
import {
  filterByKeys,
  filterByVibe,
  filterByAmenity,
  filterBySex,
  sortProperties,
  filterByRange,
  paginate,
} from "./pure";
import { pipe } from "ramda";

const getAllProperties = async (req, res) => {
  const {
    page = 1,
    limit = 5,
    sort,
    vibe,
    amenity,
    sex,
    range,
    ...filters
  } = req.query;

  const properties = await prisma.property.findMany({
    include: {
      price: true,
      rating: true,
      products: true,
    },
  });

  const filterAndSortAndPaginate = pipe(
    filterByKeys(filters),
    filterByVibe(vibe),
    filterByAmenity(amenity),
    filterBySex(sex),
    sortProperties(sort),
    filterByRange(range),
    paginate(page, limit)
  );

  const data = filterAndSortAndPaginate(properties);

  const result = {
    all_items: data.length,
    page: parseInt(page),
    max_page: Math.ceil(properties.length / limit),
    limit: parseInt(limit),
    data,
  };

  return res.json(result);
};

const getPropertyByTitle = async (req, res) => {
  let { title }: { title: string } = req.params;
  title = title.replace(/-/g, " ");

  try {
    const property = await prisma.property.findFirst({
      where: {
        title,
      },
      include: {
        contact: true,
        price: true,
        days: true,
        products: true,
        rating: true,
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
  const {
    title,
    vibe,
    amenities,
    photos,
    days,
    contact,
    price,
    sex,
    products,
  } = req.body;

  try {
    // Create Contact record
    const contactRecord = await prisma.contact.create({
      data: {
        phone: contact.phone,
        city: contact.city,
        district: contact.district,
        address: contact.address,
        location: contact.location,
      },
    });

    // Create Price record
    const priceRecord = await prisma.price.create({
      data: {
        adult: price.adult,
        child: price.child,
        scrub: price.scrub,
      },
    });

    // Create Property record with references to Contact and Price records
    const property = await prisma.property.create({
      data: {
        title,
        vibe,
        amenities,
        photos,
        sex,
        days: {
          create: days,
        },
        contactId: contactRecord.id,
        priceId: priceRecord.id,
        products: {
          create: products,
        },
      },
    });

    return res.json(property);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { getAllProperties, getPropertyByTitle, createProperty };
