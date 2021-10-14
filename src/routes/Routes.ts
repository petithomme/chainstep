import {LoginController} from "../controllers/LoginController";
import {Express, Request, Response} from "express";
import {ChatController} from "../controllers/ChatController";

module.exports = function(app: Express) {

    const loginController: LoginController = new LoginController();
    const chatController: ChatController = new ChatController();
    chatController.createChatsServer();

    app.post('/createUser', async function (req: Request, res: Response) {
        await loginController.createUser(<string>req.body.username, <string>req.body.password, <string>req.body.email);
        const token: string = await loginController.login(<string>req.body.username, <string>req.body.password);
        handleLoginProcess(req, res, token);
    });

    app.post('/login', async function (req: Request, res: Response) {
        const token: string = await loginController.login(<string>req.body.username, <string>req.body.password);
        handleLoginProcess(req, res, token);
    });

    app.get('/', function (req: Request, res: Response) {
        res.render("login", {url: req.protocol + '://' + req.get('host')});
    });

    function handleLoginProcess(req: Request, res: Response, token: string): void {
        if (!token) {
            // todo add error message
            res.redirect('/');
        } else {

            res.render("chat");
        }
    }
}
