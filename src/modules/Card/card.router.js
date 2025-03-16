import { Router } from "express";
import { DeleteData, getData, getOneData, SendData } from "./card.controller.js";
const CardRoter = Router();    

CardRoter.post('/',SendData)
CardRoter.get('/',getData)
CardRoter.get('/:id',getOneData)
CardRoter.delete('/:id',DeleteData)

export default CardRoter