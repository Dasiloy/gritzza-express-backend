import "express-async-errors";
import "./services/passport.service";
import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./connect-db";
import morgan from "morgan";
import { Logger } from "./services/logger.service";
import { notFoundMiddleware } from "./middleware/not-found";
import { errorHandlerMiddleware } from "./middleware/error-handler";

// routes imports
import userRouter from "./modules/users/user.routes";
import authRouter from "./modules/auth/auth.router";
import storeRouter from "./modules/stores/stores.routes";
import productRouter from "./modules/products/products.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use("/api/users", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/stores", storeRouter);
app.use("/api/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  const logger = Logger.getInstance();
  const port = process.env.PORT || 5000;
  try {
    logger.log(`Connecting to database...`);
    await connectDB(process.env.MONGO_URI as string);
    app.listen(port, () =>
      logger.log(`Server started on port ${port}`)
    );
  } catch (error) {
    logger.error(error);
  }
};

start();
