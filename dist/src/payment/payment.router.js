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
exports.paymentRouter.get('/retrieve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.query;
        const session = yield stripe.checkout.sessions.retrieve(session_id);
        const invoice = yield stripe.invoices.retrieve(session.invoice);
        res.status(200).json(invoice);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.paymentRouter.get('/graph', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntents = yield stripe.paymentIntents.list({ limit: 20 });
        const succeededPaymentIntents = paymentIntents.data.filter((paymentIntent) => paymentIntent.metadata.productname !== undefined);
        const dataChart = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };
        succeededPaymentIntents.forEach((element) => {
            const date = new Date(element.metadata.dateofreservation);
            const month = date.getMonth();
            switch (month) {
                case 0:
                    dataChart.January = dataChart.January + 1;
                    break;
                case 1:
                    dataChart.February = dataChart.February + 1;
                    break;
                case 2:
                    dataChart.March = dataChart.March + 1;
                    break;
                case 3:
                    dataChart.April = dataChart.April + 1;
                    break;
                case 4:
                    dataChart.May = dataChart.May + 1;
                    break;
                case 5:
                    dataChart.June = dataChart.June + 1;
                    break;
                case 6:
                    dataChart.July = dataChart.July + 1;
                    break;
                case 7:
                    dataChart.August = dataChart.August + 1;
                    break;
                case 8:
                    dataChart.September = dataChart.September + 1;
                    break;
                case 9:
                    dataChart.October = dataChart.October + 1;
                    break;
                case 10:
                    dataChart.November = dataChart.November + 1;
                    break;
                case 11:
                    dataChart.December = dataChart.December + 1;
                    break;
                default:
                    break;
            }
        });
        res.status(200).json(dataChart);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.paymentRouter.post('/save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const event = req.body;
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const checkout = event.data.object;
                const invoice = yield stripe.invoices.retrieve(checkout.invoice);
                const product_id = (_a = invoice.lines.data[0].price) === null || _a === void 0 ? void 0 : _a.id;
                const checkDuplicate = yield (0, reservation_service_1.get)(product_id, checkout.metadata.date, checkout.metadata.schedule);
                if (checkDuplicate.length)
                    return res
                        .status(409)
                        .json({ error: true, message: 'The Schedule was already taken' });
                yield (0, email_1.sendInvoice)(invoice.customer_email, invoice.hosted_invoice_url, {
                    date: checkout.metadata.schedule,
                    time: checkout.metadata.date,
                });
                yield (0, reservation_service_1.create)({
                    dateofreservation: checkout.metadata.date,
                    timerange: checkout.metadata.schedule,
                    product_id: product_id,
                });
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                console.log(paymentMethod);
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//# sourceMappingURL=payment.router.js.map