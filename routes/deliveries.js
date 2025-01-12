

import express from 'express';
import Delivery from '../models/Delivery.js';
import { auth, authorize } from '../middleware/auth.js';
import { io } from '../server.js';

const router = express.Router();

router.post('/', auth, authorize(['manager', 'pantry']), async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate({
        path: 'dietChartId',
        populate: { path: 'patientId' }
      });
    io.emit('newDelivery', populatedDelivery);
    res.status(201).json(populatedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({
        path: 'dietChartId',
        populate: { path: 'patientId' }
      });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize(['pantry', 'delivery']), async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate({
        path: 'dietChartId',
        populate: { path: 'patientId' }
      });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    io.emit('deliveryUpdated', delivery);
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

