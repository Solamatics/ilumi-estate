import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateUserInfo = async (req, res, next) => {
  console.log("req.user.userId :", req.user.userId);
  console.log("req.params.id :", req.params.id);
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

export const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

//get user
export const getUser = async (req, res, next) => {
  const userId = req.params.id; // Extract the ID value
  const user = await User.findById(userId);
  console.log(user);
  const { pass: password, ...userInfo } = user._doc;

  res.status(200).json({ userInfo });
  return;
};

//delete user
export const deleteUser = async (req, res, next) => {
  console.log("req.user.userId :", req.user.userId);
  console.log("req.params.id :", req.params.id);
  if (req.user.userId !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User successfully deleted!" });
  } catch (err) {
    next(err);
  }
};


//get user listing
export const getUserListings = async (req, res, next) => {
  
  if(req.user.userId === req.params.id) {
    try{
      const listings = await Listing.find({ userRef: req.params.id })
      res.status(200).json(listings)
    }catch(err) {
      next(err)
    }
  }else {
    return next(errorHandler(401, 'You can only view your own listing'))
  }
}