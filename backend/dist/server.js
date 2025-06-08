// server.ts
import express from 'express';
import cors from 'cors';
// import authRoutes from './routes/authRoutes.js';
// // import roleRoutes from './routes/roleRoutes';
import forumRoutes from './routes/forumRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import libraryProfileRoutes from './routes/libraryProfileRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
// import bookRoutes from './routes/bookRoutes';
// import dashboardRoutes from './routes/dashboardRoutes';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
const app = express();
app.use(express.json());
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://www.studentsadda.com',
    'https://studentsadda.com',
    "https://dev-173h8fm3s2l6fjai.us.auth0.com",
    process.env.FRONTEND_URL,
].filter((origin) => Boolean(origin));
// CORS middleware for bear token authentication
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// // Routes
// // app.use('/api/roles', roleRoutes);
app.use("/api/user", userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/libraries', libraryRoutes);
app.use('/api/library/profile', libraryProfileRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/memberships', membershipRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/seed', seedDatabase);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
// app.use('/api/auth', authRoutes);
// Test route
app.get('/api/test', (_req, res) => {
    res.json({ message: 'LMS API is working correctly!' });
});
export default app;
//# sourceMappingURL=server.js.map