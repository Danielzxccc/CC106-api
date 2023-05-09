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
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.get = exports.create = void 0;
const db_1 = require("../../config/db");
function create(details) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.client)('reservations').insert(details).returning('*');
    });
}
exports.create = create;
function get(reservation, dateofreservation = '2020-01-01', timerange = '') {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.client)('reservations').where({
            product_id: reservation,
            dateofreservation,
            timerange,
        });
    });
}
exports.get = get;
function check(reservation, dateofreservation = '2020-01-01') {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, db_1.client)('reservations').where({
            product_id: reservation,
            dateofreservation,
        });
    });
}
exports.check = check;
//# sourceMappingURL=reservation.service.js.map