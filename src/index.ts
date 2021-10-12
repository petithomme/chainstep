import express, {Express} from 'express';
import cors from 'cors';
import {MysqlConnection} from "./databases/MysqlConnection";
import {Cache} from "./cache/Cache";
import bodyParser from "body-parser";

const path = require('path');

const app: Express = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
require('./routes/Routes')(app);

app.listen(5000, async () => {
    const con: MysqlConnection = await MysqlConnection.instance;
    await con.init();
    await Cache.instance;
    console.log("Listening on port 5000");
}) ;
