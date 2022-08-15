"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
require("./services/passport.service");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_db_1 = require("./connect-db");
const morgan_1 = __importDefault(require("morgan"));
const logger_service_1 = require("./services/logger.service");
const not_found_1 = require("./middleware/not-found");
const error_handler_1 = require("./middleware/error-handler");
const cors_1 = __importDefault(require("cors"));
// routes imports
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const stores_routes_1 = __importDefault(require("./modules/stores/stores.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// security middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("static"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// routes
app.use("/api/users", user_routes_1.default);
app.use("/api/auth/", auth_routes_1.default);
app.use("/api/stores", stores_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use(not_found_1.notFoundMiddleware);
app.use(error_handler_1.errorHandlerMiddleware);
const start = async () => {
    const logger = logger_service_1.Logger.getInstance();
    const port = process.env.PORT || 5000;
    try {
        logger.log(`Connecting to database...`);
        await (0, connect_db_1.connectDB)(process.env.MONGO_URI);
        app.listen(port, () => logger.log(`Server started on port ${port}`));
    }
    catch (error) {
        logger.error(error);
    }
};
start();
