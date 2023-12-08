import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("authHeader :", authHeader);

  console.log("vtoken :", token)

  if (token === null) return res.status(401).json({ error: "Unauthorized" });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
