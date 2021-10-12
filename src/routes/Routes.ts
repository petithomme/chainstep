import {LoginController} from "../controllers/LoginController";
import {Express, Request, Response} from "express";

module.exports = function(app: Express) {

    const loginController: LoginController = new LoginController();

    app.post('/createUser', async function (req: Request, res: Response) {
        await loginController.createUser(<string>req.body.username, <string>req.body.password, <string>req.body.email);
        const token: string = await loginController.login(<string>req.body.username, <string>req.body.password);
        handleLoginProcess(res, token);
    });

    app.post('/login', async function (req: Request, res: Response) {
        const token: string = await loginController.login(<string>req.body.username, <string>req.body.password);
        handleLoginProcess(res, token);
    });

    app.get('/', function (req: Request, res: Response) {
        res.render("login", {url: req.protocol + '://' + req.get('host')});
    });

    function handleLoginProcess(res: Response, token: string): void {
        if (!token) {
            // todo add error message
            res.redirect('/');
        } else {
            res.render("chat");
        }
    }
}
