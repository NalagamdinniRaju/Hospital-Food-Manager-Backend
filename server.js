
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import dietChartRoutes from './routes/dietCharts.js';
import deliveryRoutes from './routes/deliveries.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import User from './models/User.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Our React frontend URL
  credentials: true
}));
// app.use(cors());
app.use(express.json());



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Seed users after connection is established
    await seedUsers(); // Ensure seeding happens after DB connection is established
  } catch (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);  // Exit the application if the database connection fails
  }
};

// Seed users function
const seedUsers = async () => {
  const users = [
    {
      email: 'hospital_manager@xyz.com',
      password: 'Password@2025',
      role: 'manager',
      name: 'Hospital Manager',
    },
    {
      email: 'hospital_pantry@xyz.com',
      password: 'Password@2025',
      role: 'pantry',
      name: 'Hospital Pantry',
    },
    {
      email: 'hospital_delivery@xyz.com',
      password: 'Password@2025',
      role: 'delivery',
      name: 'Hospital Delivery',
    },
  ];

  try {
    // Iterate through the users array and create each user
    for (let userData of users) {
      const { email, password, role, name } = userData;

      // Check if the user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        console.log(`User with email ${email} already exists. Skipping.`);
      } else {
        // Create a new user instance
        const user = new User({
          email,
          password,
          role,
          name,
        });

        // Save the user to the database
        await user.save();
        console.log(`User ${name} with role ${role} created.`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Call the connectDB function to establish connection
connectDB().then(() => {
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/diet-charts', dietChartRoutes);
  app.use('/api/deliveries', deliveryRoutes);

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { io };
