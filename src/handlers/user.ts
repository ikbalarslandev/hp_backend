import { create } from "domain";
import prisma from "../db";
import { createJWT } from "../modules/auth";

export const createNewUser = async (req, res) => {
  const user = prisma.user.create({
    data: {
      username: req.body.username,
      password: req.body.password,
    },
  });

  const token = createJWT(user);

  res.json({ token });
};

export const signIn = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      name: req.body.username,
    },
  });

  const isValid = await bcrypt.compare(req.body.password, user.password);
};
