import prisma from "../db";

const createReview = async (req, res) => {
  const {
    type,
    rate_location,
    rate_staff,
    rate_atmosphere,
    rate_cleanliness,
    rate_facilities,
    rate_value_for_money,
    comment,
    propertyId,
    userId,
  } = req.body;

  const rate_overall =
    (rate_location +
      rate_staff +
      rate_atmosphere +
      rate_cleanliness +
      rate_facilities +
      rate_value_for_money) /
    6;

  try {
    const review = await prisma.review.create({
      data: {
        type,
        rate_location,
        rate_staff,
        rate_atmosphere,
        rate_cleanliness,
        rate_facilities,
        rate_value_for_money,
        rate_overall,
        comment,
        propertyId,
        userId,
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
          sum: review.rate_overall,
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
          sum:
            (rating.sum * rating.count + review.rate_overall) /
            (rating.count + 1),
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
  const { propertyId, userId } = req.query;
  try {
    const review = await prisma.review.findFirst({
      where: {
        propertyId,
        userId,
      },
    });

    return res.json({ isExist: !!review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { createReview, isExist };
