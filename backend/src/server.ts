// server.ts
import express from 'express';
import cors from 'cors';



// import authRoutes from './routes/authRoutes.js';
// // import roleRoutes from './routes/roleRoutes';
// import forumRoutes from './routes/forumRoutes';
// import libraryRoutes from './routes/libraryRoutes';
// import bookingRoutes from './routes/bookingRoutes';
// import membershipRoutes from './routes/membershipRoutes';
// import bookRoutes from './routes/bookRoutes';
// import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes.js';


const app = express();
app.use(express.json());


const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://www.studentsadda.com/',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));


// CORS middleware for bear token authentication
app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
)


// // Routes
// // app.use('/api/roles', roleRoutes);
// app.use('/api/forum', forumRoutes);
// app.use('/api/library', libraryRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/memberships', membershipRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes)

// Test route
app.get('/api/test', (_req, res) => {
  res.json({ message: 'LMS API is working correctly!' });
});






export default app;