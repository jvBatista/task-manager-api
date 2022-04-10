import express from "express";
// import 'dotenv/config';
import bodyParser from "body-parser";
import databaseConnect from './database/db';
import router from "./router";

require('dotenv').config();

const app = express();

const PORT = process.env.APP_PORT || 5000;

databaseConnect();

app.use(bodyParser.json());
app.use("/", router);

// Listen to server on port
app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});
