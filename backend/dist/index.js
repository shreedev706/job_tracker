"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running smoothly!' });
});
app.use('/auth', auth_routes_1.default);
app.use('/applications', application_routes_1.default);
app.use(error_middleware_1.globalErrorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});
