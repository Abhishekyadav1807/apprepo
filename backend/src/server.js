require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
  return next();
});

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect DB', error);
    process.exit(1);
  });
