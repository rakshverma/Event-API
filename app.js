require('dotenv').config();
const express = require('express');
const eventRoutes = require('./routes/eventRoutes.js');
const app = express();
const api = require('./middlewares/api.js');

app.use(api);

app.use(express.json());
app.use('/api/events', eventRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
