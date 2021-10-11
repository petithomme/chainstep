import bcrypt from 'bcrypt';
import {MysqlConnection} from "../databases/MysqlConnection";
import {ILogin} from "../interfaces/ILogin";
import {Cache} from "../cache/Cache";
import { v4 as uuidv4 } from 'uuid';

export class LoginController {

    public async login(username: string, password: string): Promise<string> {
        let result: string = "";
        if (!username || !password) {
            //todo log error
        } else {
            const query: string = "SELECT * from users where userName =?";
            const queryResult: ILogin[] = await MysqlConnection.instance.query(query, [username]);
            if (queryResult.length == 1) {
                const hash: string = bcrypt.hashSync(password, queryResult[0].salt);
                const loggedIn: boolean = bcrypt.compareSync(queryResult[0].password, hash);
                if (loggedIn) {
                    result = uuidv4();
                    Cache.instance.set(username, result);
                }
            } else {
                console.log("queryResult is not 1");
                //todo log error
            }
        }
        return result;
    }

    public async createUser(username: string, password: string, email: string): Promise<void> {
        const exist: boolean = await this.userExists(username);
        if (exist) {
            // todo add popup
        } else {
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hashSync(password, salt);
            await this.insertUser(username, hashedPassword, salt, email);
        }
    }

    private async insertUser(username: string, password: string, salt: string, email: string): Promise<void> {
        const query: string = "INSERT INTO users (`username`, `password`, `salt`, `email`) VALUES (?, ?, ?, ?)"
        await MysqlConnection.instance.query(query, [username,password, salt, email]);
    }

    private async userExists(userName: string): Promise<boolean> {
        const query: string = "SELECT * FROM users where userName=?";
        const rows: ILogin[] = await MysqlConnection.instance.query(query, [userName]);
        return rows.length > 0;
    }
}

