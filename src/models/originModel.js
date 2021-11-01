const mongoose = require('mongoose');

const originSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  shortid: { type: String, required: true },
  data: { type: Array, required: true },
});

const OriginModel = mongoose.model('Origin', originSchema);
module.exports = OriginModel;
