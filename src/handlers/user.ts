import prisma from "../db";

const createUser = async (req, res) => {
  const { name, email, image, nationality, age_range, gender } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        image,
        nationality,
        age_range,
        gender,
      },
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        reviews: true,
      },
    });

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { createUser, getUserByEmail };
