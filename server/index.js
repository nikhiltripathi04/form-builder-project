import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import formRoutes from './routes/formRoutes.js';
import responseRoutes from './routes/responseRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies

// A simple test route
app.get('/', (req, res) => {
  res.send('Form builder API is running!');
});

app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes); 

//mongodb connection
connectDB()
  .then(() => {
    console.log('Database connected successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

//Global error handling middleware  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});