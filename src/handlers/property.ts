import prisma from "../db";

const getAllProperties = async (req, res) => {
  const { page, limit, sort, vibe, amenity, sex, range, ...filters } =
    req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 5;

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = pageNumber * limitNumber;

  const properties = await prisma.property.findMany({
    include: {
      price: true,
      rating: true,
    },
  });

  const filteredProperties = properties.filter((property) => {
    return Object.keys(filters).every((filter) => {
      if (filter.includes("_")) {
        const [key, subKey] = filter.split("_");
        return property[key][subKey] === filters[filter];
      }

      return property[filter] == filters[filter];
    });
  });

  const vibeProperties = filteredProperties.filter((property) => {
    const parsedVibe = vibe && JSON.parse(vibe);
    if (parsedVibe) {
      return parsedVibe.includes(property.vibe);
    }
    return true;
  });

  const amenityProperties = vibeProperties.filter((property) => {
    const parsedAmenity = amenity && JSON.parse(amenity);
    if (parsedAmenity) {
      return parsedAmenity.every((amenity) => {
        return property.amenities.includes(amenity);
      });
    }
    return true;
  });

  const sexProperties = amenityProperties.filter((property) => {
    const parsedSex = sex ? JSON.parse(sex) : [];
    if (parsedSex.length > 0) {
      return parsedSex.includes(property.sex);
    }
    return true;
  });

  const sortedProperties = sexProperties.sort((a, b) => {
    const priceA = a.price.adult;
    const priceB = b.price.adult;

    if (sort === "cheap") {
      return priceA - priceB;
    }

    if (sort === "expensive") {
      return priceB - priceA;
    }

    return 0;
  });

  const rangeProperties = sortedProperties.filter((property) => {
    if (range) {
      const [min, max] = JSON.parse(range);
      return property.price.adult >= min && property.price.adult <= max;
    }
    return true;
  });

  const data = rangeProperties.slice(startIndex, endIndex);

  const result = {
    all_items: rangeProperties.length,
    page: pageNumber,
    max_page: Math.ceil(rangeProperties.length / limitNumber),
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
        rating: true,
        reviews: true,
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
