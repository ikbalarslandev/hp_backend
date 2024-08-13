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
        rate: rate_overall,
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
          count: 1,
          rate_overall,
          rate_location,
          rate_staff,
          rate_atmosphere,
          rate_cleanliness,
          rate_facilities,
          rate_value_for_money,
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
      const rating = await prisma.rating.findUnique({
        where: {
          id: property.ratingId,
        },
      });

      const calculateAverage = (type: string): number => {
        const currentRating = rating[type] || 0;
        const newRating =
          type == "rate_overall" ? rate_overall : req.body[type] || 0;
        return (currentRating * rating.count + newRating) / (rating.count + 1);
      };

      await prisma.rating.update({
        where: {
          id: rating.id,
        },
        data: {
          count: rating.count + 1,
          rate_overall: calculateAverage("rate_overall"),
          rate_location: calculateAverage("rate_location"),
          rate_staff: calculateAverage("rate_staff"),
          rate_atmosphere: calculateAverage("rate_atmosphere"),
          rate_cleanliness: calculateAverage("rate_cleanliness"),
          rate_facilities: calculateAverage("rate_facilities"),
          rate_value_for_money: calculateAverage("rate_value_for_money"),
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
