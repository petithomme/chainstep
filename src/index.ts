import express from 'express';
import cors from 'cors';
import {LoginController} from "./controllers/LoginController";
import {MysqlConnection} from "./databases/MysqlConnection";
import { Request, Response } from 'express';
import {Cache} from "./cache/Cache";
import bodyParser from "body-parser";

var path = require('path');
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const loginController: LoginController = new LoginController();
app.post('/createUser', async function (req: Request, res: Response) {
    await loginController.createUser(<string>req.body.username, <string>req.body.password, <string>req.body.email);
    res.status(200).json({error: ""});
});

app.post('/login', async function (req: Request, res: Response) {
    const token: string = await loginController.login(<string>req.body.username, <string>req.body.password);
    if (!token) {
        // todo add error message
        res.redirect('/');
    } else {
        // todo render chat
        res.status(200).json({error: "", token});
    }
});
app.get('/', function (req: Request, res: Response) {
    res.render("login", {url: req.protocol + '://' + req.get('host')});
});

app.listen(5000, async () => {
    const con: MysqlConnection = await MysqlConnection.instance;
    await con.init();
    await Cache.instance;
    console.log("Listening on port 5000");
}) ;
