import express from "express";
import cors from "cors";
import router from "./router/auth.route.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
const port = 8000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("This is the landing page of the Real Estate app backend!");
});

// Auth Router
app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
