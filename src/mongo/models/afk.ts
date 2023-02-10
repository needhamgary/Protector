import { model, models, Schema } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const afkSchema = new Schema({
  _id: reqString,
  username: reqString,
  date: { type: Number, default: Date.now() },
  reason: reqString,
});

const name: string = "afk";
export default model(name, afkSchema, name);
