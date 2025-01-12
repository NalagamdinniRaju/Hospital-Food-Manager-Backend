import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  ingredients: [String],
  instructions: [String],
});

const dietChartSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  morning: mealSchema,
  evening: mealSchema,
  night: mealSchema,
});

export default mongoose.model('DietChart', dietChartSchema);

