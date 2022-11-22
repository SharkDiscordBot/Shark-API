import * as mongoose from "mongoose";

const Schema = new mongoose.Schema({
  _id: {
    type: String
  },
  commit_hash: {
    type: String
  },
  local_branch: {
    type: String
  }
});

const model = mongoose.model("system", Schema);

export default model;