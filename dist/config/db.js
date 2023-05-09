"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const knex_1 = __importDefault(require("knex"));
exports.client = (0, knex_1.default)({
    client: 'cockroachdb',
    connection: process.env.CONNECTION_URI,
});
//# sourceMappingURL=db.js.map