import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";

export const comparePassword = async (password, hash) => {
  return await bycrypt.compare(password, hash);
};

export const hashPassword = async (password) => {
  return await bycrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = bearer.split(" ")[1];

  if (!bearer) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "not valid token",
    });
  }
};
