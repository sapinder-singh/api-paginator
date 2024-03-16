import { Schema, model } from 'mongoose';

const originSchema = new Schema({
  endpoint: { type: String, required: true },
  shortid: { type: String, required: true },
  data: { type: Array, required: true },
});

const OriginModel = model('Origin', originSchema);
export default OriginModel;
