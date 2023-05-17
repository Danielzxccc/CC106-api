"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_service_1 = require("./auth.service");
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield (0, auth_service_1.findUser)(username);
        if (!user.length)
            return res.status(400).json({
                message: 'Invalid Credentials',
            });
        const compare = yield bcrypt_1.default.compare(password, user[0].password);
        if (!compare)
            return res.status(401).json({
                error: true,
                message: 'Unauthorized Access!',
            });
        req.session.users = user[0];
        res.status(200).json({
            message: 'Success',
            user: req.session.users,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}));
exports.authRouter.get('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.users) {
        res.json({ token: true, user: req.session.users });
    }
    else {
        res.json({ token: false });
    }
}));
exports.authRouter.delete('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'unable to logout' });
            }
            else {
                res.status(200).json({ message: 'logout successfully' });
            }
        });
    }
}));
//# sourceMappingURL=auth.router.js.map