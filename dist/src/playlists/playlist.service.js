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
exports.CreatePlaylist = exports.ListPlaylists = void 0;
const db_1 = require("../../config/db");
const ListPlaylists = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.client.queryBuilder().select('*').from('playlist');
});
exports.ListPlaylists = ListPlaylists;
const CreatePlaylist = (playlist) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.client.queryBuilder().insert(playlist).into('playlist').returning('*');
});
exports.CreatePlaylist = CreatePlaylist;
//# sourceMappingURL=playlist.service.js.map