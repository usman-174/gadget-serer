import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { isAuth } from "./Middleware/AuthMiddleware.js";

const app = express();

if (process.env?.NODE_ENV !== "production") {
  dotenv.config();
  app.use(morgan("dev"));
}
connectDatabase();

// Use Morgan in light mode
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsOptions = {
  origin: process.env.ORIGIN || "https://gadget-globe.vercel.app",
  credentials: true,
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));
app.use(cookieParser());
// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", isAuth, (_, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "CLIENT_ID");
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
