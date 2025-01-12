import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  diseases: [String],
  allergies: [String],
  roomNumber: { type: String, required: true },
  bedNumber: { type: String, required: true },
  floorNumber: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactInformation: { type: String, required: true },
  emergencyContact: { type: String, required: true },
});

export default mongoose.model('Patient', patientSchema);

