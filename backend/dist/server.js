"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import authRoutes from './routes/authRoutes.js';
// // import roleRoutes from './routes/roleRoutes';
const forumRoutes_js_1 = __importDefault(require("./routes/forumRoutes.js"));
const libraryRoutes_js_1 = __importDefault(require("./routes/libraryRoutes.js"));
// import bookingRoutes from './routes/bookingRoutes';
// import membershipRoutes from './routes/membershipRoutes';
// import bookRoutes from './routes/bookRoutes';
// import dashboardRoutes from './routes/dashboardRoutes';
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const dashboardRoutes_js_1 = __importDefault(require("./routes/dashboardRoutes.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://www.studentsadda.com',
    'https://studentsadda.com',
    "https://dev-173h8fm3s2l6fjai.us.auth0.com",
    process.env.FRONTEND_URL,
].filter((origin) => Boolean(origin));
// CORS middleware for bear token authentication
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// // Routes
// // app.use('/api/roles', roleRoutes);
app.use("/api/user", userRoutes_js_1.default);
app.use('/api/forum', forumRoutes_js_1.default);
app.use('/api/libraries', libraryRoutes_js_1.default);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/memberships', membershipRoutes);
// app.use('/api/books', bookRoutes);
app.use('/api/dashboard', dashboardRoutes_js_1.default);
// app.use('/api/auth', authRoutes);
// Test route
app.get('/api/test', (_req, res) => {
    res.json({ message: 'LMS API is working correctly!' });
});
exports.default = app;
//# sourceMappingURL=server.js.map