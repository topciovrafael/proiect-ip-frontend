import express from "express";
import router from "./routes.js";

const app = express();
app.use(express.json());
app.use("/", router);        // all routes live under /

app.listen(3001, () => console.log("API running on :3001"));
