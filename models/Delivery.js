// import mongoose from 'mongoose';

// const deliverySchema = new mongoose.Schema({
//   dietChartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietChart', required: true },
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['preparing', 'ready', 'delivering', 'delivered'], default: 'preparing' },
//   mealType: { type: String, enum: ['morning', 'evening', 'night'], required: true },
//   deliveredAt: Date,
// });

// export default mongoose.model('Delivery', deliverySchema);

import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  dietChartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietChart', required: true },
  mealType: { type: String, enum: ['morning', 'evening', 'night'], required: true },
  status: { type: String, enum: ['preparing', 'ready', 'delivering', 'delivered'], default: 'preparing' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Delivery', deliverySchema);

