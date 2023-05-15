"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigins = [process.env.CLIENT_URL];
exports.corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by Cors'), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
//# sourceMappingURL=cors.js.map