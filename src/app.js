const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const expressOasGenerator = require('express-oas-generator');
const app = express();
app.use(cors());
expressOasGenerator.init(app, {});
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'hi' });
});


app.use('/api/auth', authRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/maintenance', maintenanceRoutes);

module.exports = app;