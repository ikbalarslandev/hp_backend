import { Request, Response } from "express";
import prisma from "../db";

const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany();
    return res.json(countries);
  } catch (error) {
    console.error(error);
    return res.json({ error: "Country not found or an error occurred" });
  }
};

const getCountryByTld = async (req: Request, res: Response) => {
  const { tld } = req.params;

  try {
    const country = await prisma.country.findUnique({
      where: {
        tld,
      },
    });
    return res.json(country);
  } catch (error) {
    console.log("heheh");
    console.error(error);
    return res.json({ error: "Country not found or an error occurred" });
  }
};

export { getCountries, getCountryByTld };
