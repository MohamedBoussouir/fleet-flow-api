const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const rapportRoutes = require('./routes/rapportRoutes');
const chauffeurRoutes = require('./routes/chauffeurRoutes');

const app = express();
app.use(cors());
app.use(express.json());


const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => {
    res.json({ message: 'hi' });
});

app.use('/api/auth', authRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);
app.use('/api/rapports', rapportRoutes);

module.exports = app;