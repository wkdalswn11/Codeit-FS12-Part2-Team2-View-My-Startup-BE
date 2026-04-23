import express from "express";
import cors from "cors";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use(cors());

app.use(express.json());

export default app;
