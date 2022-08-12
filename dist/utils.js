"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static isEmpty(obj) {
        const objToArray = Object.keys(obj);
        return objToArray.length === 0;
    }
}
exports.Utils = Utils;
