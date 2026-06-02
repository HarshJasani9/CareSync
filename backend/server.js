require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Global Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Body parser for JSON
app.use(morgan('dev'));
app.use(limiter);

// API Routes Stubs
const apiRouter = express.Router();

apiRouter.use('/auth', (req, res) => res.json({ message: 'Auth Route Stub' }));
apiRouter.use('/doctors', (req, res) => res.json({ message: 'Doctors Route Stub' }));
apiRouter.use('/appointments', (req, res) => res.json({ message: 'Appointments Route Stub' }));
apiRouter.use('/prescriptions', (req, res) => res.json({ message: 'Prescriptions Route Stub' }));
apiRouter.use('/records', (req, res) => res.json({ message: 'Records Route Stub' }));
apiRouter.use('/reviews', (req, res) => res.json({ message: 'Reviews Route Stub' }));
apiRouter.use('/admin', (req, res) => res.json({ message: 'Admin Route Stub' }));

// Mount all route files under /api
app.use('/api', apiRouter);

// Mount global error handler last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
