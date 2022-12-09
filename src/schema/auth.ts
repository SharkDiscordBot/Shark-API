import * as mongoose from "mongoose";

const Schema = new mongoose.Schema({
  _id: {
    type: String
  },
  api_key: {
    type: String
  },
  iv: {
    type: String
  }
});

const model = mongoose.model("auth", Schema);

export default model;