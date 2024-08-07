import prisma from "../db";

const createReview = async (req, res) => {
  const { propertyId, name, email, img, rate, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        name,
        email,
        img,
        rate,
        comment,
        belongsToId: propertyId,
      },
    });

    // after creating a review, we need to update the property's rating
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property.ratingId) {
      const rating = await prisma.rating.create({
        data: {
          sum: review.rate,
          count: 1,
        },
      });
      const updatedProperty = await prisma.property.update({
        where: {
          id: property.id,
        },
        data: {
          ratingId: rating.id,
        },
      });
      console.log("updatedProperty", updatedProperty);
    } else {
      const rating = await prisma.rating.findFirst({
        where: {
          id: property.ratingId,
        },
      });

      await prisma.rating.update({
        where: {
          id: rating.id,
        },
        data: {
          sum: (rating.sum * rating.count + review.rate) / (rating.count + 1),
          count: rating.count + 1,
        },
      });
    }

    return res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const isExist = async (req, res) => {
  const { email, propertyId } = req.query;
  try {
    const review = await prisma.review.findFirst({
      where: {
        email,
        belongsToId: propertyId,
      },
    });

    return res.json({ isExist: !!review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { createReview, isExist };
