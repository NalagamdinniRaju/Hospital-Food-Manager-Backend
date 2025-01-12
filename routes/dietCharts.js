
import express from 'express';
import DietChart from '../models/DietChart.js';
import { auth, authorize } from '../middleware/auth.js';
import { io } from '../server.js';

const router = express.Router();

router.post('/', auth, authorize(['manager']), async (req, res) => {
  try {
    const dietChart = new DietChart(req.body);
    await dietChart.save();
    res.status(201).json(dietChart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const dietCharts = await DietChart.find().populate('patientId');
    res.json(dietCharts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize(['manager']), async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId');
    if (!dietChart) return res.status(404).json({ message: 'Diet chart not found' });
    io.emit('dietChartUpdated', dietChart);
    res.json(dietChart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, authorize(['manager']), async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);
    if (!dietChart) return res.status(404).json({ message: 'Diet chart not found' });
    res.json({ message: 'Diet chart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

