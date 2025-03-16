import { Card } from "../../../DB/models/card.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";

const SendData = catchError(async (req, res, next) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json({ message: "card created successfully", card });
});

const getData = catchError(async (req, res, next) => {
  const card = await Card.find();
  res.status(200).json({ message: "card fetched successfully", card });
});

const getOneData = catchError(async (req, res, next) => {
  const card = await Card.findById(req.params.id);
  res.status(200).json({ message: "card fetched successfully", card });
});

const DeleteData = catchError(async (req, res, next) => {
  const card = await Card.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "card deleted successfully", card });
});

export { SendData, getData, getOneData, DeleteData };
