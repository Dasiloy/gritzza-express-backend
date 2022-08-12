"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor() { }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(message, context = "LOG") {
        console.log(new Date().toISOString(), `[${context}]`, message);
    }
    error(error, context = "ERROR") {
        console.error(new Date().toISOString(), `[${context}]`, error);
    }
}
exports.Logger = Logger;
