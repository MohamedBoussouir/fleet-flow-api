const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const client = require('prom-client');
const register = new client.Registry();



const authRoutes = require('./routes/authRoutes');
const camionRoutes = require('./routes/camionRoutes');
const remorqueRoutes = require('./routes/remorqueRoutes');
const pneuRoutes = require('./routes/pneuRoutes');
const trajetRoutes = require('./routes/trajetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const rapportRoutes = require('./routes/rapportRoutes');
const chauffeurRoutes = require('./routes/chauffeurRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const rateLimiter = require('./middlewares/rateLimiterMiddleware');

const v2Routes = require('./routes/v2');

const app = express();
app.use(cors());
app.use(express.json());

const globalLimiter = rateLimiter({ windowMs: 60 * 1000, max: 100 });

const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => {
    res.json({ message: 'hi' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/camions', globalLimiter, camionRoutes);
app.use('/api/remorques', globalLimiter, remorqueRoutes);
app.use('/api/pneus', globalLimiter, pneuRoutes);
app.use('/api/trajets', globalLimiter, trajetRoutes);
app.use('/api/maintenance', globalLimiter, maintenanceRoutes);
app.use('/api/chauffeurs', globalLimiter, chauffeurRoutes);
app.use('/api/rapports', globalLimiter, rapportRoutes);


app.use('/api/v2', globalLimiter, v2Routes);




client.collectDefaultMetrics({ register });



app.use(errorMiddleware);
module.exports = app;