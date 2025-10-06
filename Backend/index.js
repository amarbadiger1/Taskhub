import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './routes/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();


// Middlewares
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(morgan('dev'));


// MongoDB Connection (optional, add your Mongo URI in .env)
mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;

// Sample route
app.get('/', (req, res) => {
    res.status(200).json({'message': 'Welcome to TaskHub API'});
});


// http://localhost:5000/api-v1/
app.use('/api-v1', routes);



//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});


// Not Found middleware
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
