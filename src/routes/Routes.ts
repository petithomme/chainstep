import {LoginController} from "../controllers/LoginController";
import {Express, Request, Response} from "express";

module.exports = function(app: Express) {

    const loginController: LoginController = new LoginController();

    app.post('/createUser', async function (req: Request, res: Response) {
        await loginController.createUser(<string>req.body.username, <string>req.body.password, <string>req.body.email, <string>req.body.language);
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

    app.get('/logout', function (req: Request, res: Response) {
        loginController.logout(<string>req.query.userName, <string>req.query.token);
        res.render("login", {url: req.protocol + '://' + req.get('host')});
    });

    function handleLoginProcess(req: Request, res: Response, token: string): void {
        if (!token) {
            // todo add error message
            res.redirect('/');
        } else {
            res.render("chat", {
                userName : <string>req.body.username,
                token,
                url: req.protocol + '://' + req.get('host')
            });
        }
    }
}
