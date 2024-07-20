import express from "express";
import router from "./router";

// its a middleware for logging the request
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";

const app = express();

// this one allows us to make requests from the client to the server
app.use(cors());
app.use(morgan("dev"));
// this one allows us to parse the body of the request as json (client sends json, we can parse it)
app.use(express.json());

// client can send query params, we can parse them
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("hello from express");
  res.json({
    message: "hello",
  });
});

app.use("/api", router);

export default app;
