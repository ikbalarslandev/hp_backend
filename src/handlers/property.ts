import prisma from "../db";

const getAllProperties = async (req, res) => {
  const { page, limit, ...filters } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 5;

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  const properties = await prisma.property.findMany({
    include: {
      contact: true,
      price: true,
      days: true,
    },
  });

  const filteredProperties = properties.filter((property) => {
    return Object.keys(filters).every((filter) => {
      if (filter.includes("_")) {
        const [key, subKey] = filter.split("_");
        return property[key][subKey] === filters[filter];
      }

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
        contactId: contactRecord.id, // Use the ID of the created contact
        priceId: priceRecord.id, // Use the ID of the created price
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
