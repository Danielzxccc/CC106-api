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
const reservation_service_1 = require("../reservation/reservation.service");
const email_1 = require("../helpers/email");
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hour, priceid, date, email } = req.body;
    try {
        const session = yield stripe.checkout.sessions.create({
            customer_email: email,
            line_items: [
                {
                    price: priceid,
                    quantity: 1,
                },
            ],
            metadata: {
                schedule: hour,
                date,
            },
            invoice_creation: { enabled: true },
            client_reference_id: 'shit',
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&hour=${hour}&date=${date}&price=${priceid}`,
        });
        res.json(session);
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}));
exports.paymentRouter.get('/payments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntents = yield stripe.paymentIntents.list({ limit: 20 });
        const succeededPaymentIntents = paymentIntents.data.filter((paymentIntent) => paymentIntent.metadata.productname !== undefined);
        res.status(200).json(succeededPaymentIntents);
        // const product = await stripe.products.retrieve()
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.paymentRouter.post('/save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { session_id, dateofreservation, timerange, product_id } = req.body;
    try {
        const session = yield stripe.checkout.sessions.retrieve(session_id);
        // Retrieve the invoice associated with the payment intent
        const invoice = yield stripe.invoices.retrieve(session.invoice);
        const product = invoice.lines.data[0].price.product;
        const retrieveProduct = yield stripe.products.retrieve(product);
        const productname = retrieveProduct.name;
        // update payment intent
        yield stripe.paymentIntents.update(invoice.payment_intent, {
            metadata: {
                dateofreservation,
                timerange,
                productname,
            },
        });
        const checkDuplicate = yield (0, reservation_service_1.get)(product_id, dateofreservation, timerange);
        if (checkDuplicate.length)
            return res
                .status(409)
                .json({ error: true, message: 'The Schedule was already taken' });
        const createReservation = yield (0, reservation_service_1.create)({
            dateofreservation,
            timerange,
            product_id,
        });
        yield (0, email_1.sendInvoice)(session.customer_email, invoice.hosted_invoice_url, {
            date: dateofreservation,
            time: timerange,
        });
        res.status(201).json({
            invoice_link: invoice.hosted_invoice_url,
            details: createReservation,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//# sourceMappingURL=payment.router.js.map