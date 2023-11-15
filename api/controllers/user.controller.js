import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateUserInfo = async (req, res, next) => {
  console.log("req.user.id", req.user);
  console.log("req.params.id", req.params.id);
  if (req.user.userId !== req.params.id)
    return next(errorHandler(401, "You can only update your account!"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true },
    );
    const { password, ...other } = updatedUser._doc;
    res.status(200).json(other);
  } catch (err) {
    next(err);
  }
};
