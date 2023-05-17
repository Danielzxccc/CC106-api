"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookies_1 = __importDefault(require("cookies"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyJWT(req, res, next) {
    const splitPem = process.env.CLERK_JWT_VERIFICATION_KEY.match(/.{1,64}/g);
    console.log(process.env.CLERK_JWT_VERIFICATION_KEY);
    const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
        splitPem.join('\n') +
        '\n-----END PUBLIC KEY-----';
    const cookies = new cookies_1.default(req, res);
    const sessToken = cookies.get('__session');
    console.log(sessToken);
    if (!sessToken) {
        return res.status(401).json({ error: true, message: 'Unauthorized' });
    }
    try {
        jsonwebtoken_1.default.verify(sessToken, publicKey);
        next();
    }
    catch (error) {
        res.status(401).json({
            error: 'Invalid Token',
        });
    }
}
exports.default = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map