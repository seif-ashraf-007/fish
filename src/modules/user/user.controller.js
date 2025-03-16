import { User } from "../../../DB/models/user.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";

const SendData = catchError(async (req, res, next) => {
  try {
    console.log("Received data:", req.body);
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

const getData = catchError(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({ message: "User fetched successfully", user });
});

const getOneData = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ message: "User fetched successfully", user });
});

const DeleteData = catchError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted successfully", user });
});

const DeleteAllData = catchError(async (req, res, next) => {
  await User.deleteMany({});
  res.status(200).json({ message: "All users deleted successfully" });
});

export { SendData, getData, getOneData, DeleteData, DeleteAllData };
