import { Router } from "express";
import {
  DeleteData,
  DeleteAllData,
  getData,
  getOneData,
  SendData,
} from "./user.controller.js";
const UserRouter = Router();

UserRouter.post("/", SendData);
UserRouter.get("/", getData);
UserRouter.get("/:id", getOneData);
UserRouter.delete("/:id", DeleteData);
UserRouter.delete("/deleteAll", DeleteAllData);

export default UserRouter;
