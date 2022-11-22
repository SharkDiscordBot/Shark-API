import * as mongoose from 'mongoose';

let Schema = new mongoose.Schema({
  _id: {
    type: String
  },
  commit_hash: {
    type: String
  },
  local_branch: {
    type: String
  }
})

let model = mongoose.model('system', Schema);

export default model;