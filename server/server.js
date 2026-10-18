import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import artistsRouter from './routes/artists.js';
import appointmentsRouter from './routes/appointments.js';
import artistAppointmentsRouter from './routes/artistAppointments.js';
import adminRouter from './routes/admin.js';
import designsRouter from './routes/designs.js';
import reviewsRouter from './routes/reviews.js';
import notificationsRouter from './routes/notifications.js';
import servicesRouter from './routes/services.js';
import bookingsRouter from './routes/bookings.js';
import { isUsingSupabase } from './db/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (supporting both /api/* and direct /* paths for cloud serverless compatibility)
const routes = [
  ['/auth', authRouter],
  ['/artists', artistsRouter],
  ['/appointments', appointmentsRouter],
  ['/artist/appointments', artistAppointmentsRouter],
  ['/admin', adminRouter],
  ['/designs', designsRouter],
  ['/reviews', reviewsRouter],
  ['/notifications', notificationsRouter],
  ['/services', servicesRouter],
  ['/bookings', bookingsRouter]
];

routes.forEach(([routePath, router]) => {
  app.use(`/api${routePath}`, router);
  app.use(routePath, router);
});

// Health check endpoint
const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Mehndi Appointment Booking Platform API',
    supabaseConnected: isUsingSupabase()
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🌸 Mehndi Platform API Server is running`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`✨ Role Panels Ready: Customer, Artist, Admin`);
    console.log(`===============================================`);
  });
}

export default app;
