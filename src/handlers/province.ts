import prisma from "../db";

const getAllProvinces = async (req, res) => {
  const provinces = await prisma.province.findMany();

  return res.json(provinces);
};

const getProvincebycity = async (req, res) => {
  const { city } = req.params;

  try {
    const province = await prisma.province.findUnique({
      where: {
        city,
      },
    });

    return res.json(province);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Property not found or an error occurred" });
  }
};

const createProvince = async (req, res) => {
  const { city, districts } = req.body;

  try {
    const province = await prisma.province.create({
      data: {
        city,
        districts,
      },
    });

    return res.json(province);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { getProvincebycity, createProvince, getAllProvinces };
