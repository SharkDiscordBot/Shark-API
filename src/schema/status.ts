import * as mongoose from "mongoose";

const Schema = new mongoose.Schema({
  _id: {
    type: String
  },
  version: {
    type: String
  },
  ping: {
    type: String
  },
  status: {
    type: String
  }
});

const model = mongoose.model("status", Schema);

export default model;