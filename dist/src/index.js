"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_session_knex_1 = __importDefault(require("connect-session-knex"));
// import MemoryStore from 'memorystore'
dotenv.config();
const payment_router_1 = require("./payment/payment.router");
const reservation_router_1 = require("./reservation/reservation.router");
const auth_router_1 = require("./auth/auth.router");
const cors_2 = require("../config/cors");
const db_1 = require("../config/db");
const PORT = 8080;
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const store = new ((0, connect_session_knex_1.default)(express_session_1.default))({
    knex: db_1.client,
    tablename: 'sessions', // optional, defaults to 'sessions'
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
app.use('/api/payment', payment_router_1.paymentRouter);
app.use('/api/reservation', reservation_router_1.reservationRouter);
app.use('/api/auth', auth_router_1.authRouter);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map