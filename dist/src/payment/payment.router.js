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
exports.paymentRouter = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
const express_1 = __importDefault(require("express"));
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.create({
            line_items: [
                {
                    price: req.body.priceid,
                    quantity: 1,
                },
            ],
            customer_email: 'test123@gmail.com',
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        });
        res.json(session);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}));
exports.paymentRouter.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield stripe.products.list();
        res.json(products.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.paymentRouter.get('/save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.retrieve(req.query.session_id);
        res.status(200).json(session);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//# sourceMappingURL=payment.router.js.map