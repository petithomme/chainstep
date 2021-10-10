import express from 'express';
import cors from 'cors';
import {LoginController} from "./controllers/LoginController";
import {MysqlConnection} from "./databases/MysqlConnection";
import { Request, Response } from 'express';

const app = express();
app.use(cors());

const loginController: LoginController = new LoginController();
app.post('/createUser', async function (req: Request, res: Response) {
    await loginController.createUser(<string>req.query.username, <string>req.query.password, <string>req.query.email);
    res.status(200).json({error: ""});
})
app.post('/login', async function (req: Request, res: Response) {
    await loginController.login(<string>req.query.username, <string>req.query.password);
    res.status(200).json({error: ""});
})

app.listen(5000, async () => {
    const con: MysqlConnection = await MysqlConnection.instance;
    await con.init();
    console.log("Listening on port 5000");
}) ;
