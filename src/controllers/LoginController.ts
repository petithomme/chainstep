import bcrypt from 'bcrypt';
import {MysqlConnection} from "../databases/MysqlConnection";
import {ILogin} from "../interfaces/ILogin";
import {Cache} from "../cache/Cache";
import { v4 as uuidv4 } from 'uuid';
import {User} from "../models/User";

export class LoginController {

    public async login(username: string, password: string): Promise<string> {
        let result: string = "";
        if (!username || !password) {
            console.log("username or password incorrect");
        } else {
            const query: string = "SELECT * from users where userName =?";
            const queryResult: ILogin[] = await MysqlConnection.instance.query(query, [username]);
            if (queryResult.length == 1) {
                const hash: string = bcrypt.hashSync(password, queryResult[0].salt);
                if (queryResult[0].password == hash) {
                    result = uuidv4();
                    Cache.instance.set(username, new User(username, result, queryResult[0].language ));
                } else {
                    console.log("Password or login is incorrect");
                }
            } else {
                console.log("queryResult is not 1");
            }
        }
        return result;
    }

    public async logout(userName: string, token: string): Promise<void> {
        if (token && Cache.instance.get(userName).sessionToken === token) {
            Cache.instance.set(userName, "");
        }
    }

    public async createUser(username: string, password: string, email: string, language: string): Promise<void> {
        const exist: boolean = await this.userExists(username);
        if (exist) {
            console.log("User already exists");
        } else {
            const salt: string = await bcrypt.genSalt(10);
            const hashedPassword: string = await bcrypt.hashSync(password, salt);
            await this.insertUser(username, hashedPassword, salt, email, language);
        }
    }

    private async insertUser(username: string, password: string, salt: string, email: string, language: string): Promise<void> {
        const query: string = "INSERT INTO users (`username`, `password`, `salt`, `email`, `language`) VALUES (?, ?, ?, ?, ?)"
        await MysqlConnection.instance.query(query, [username,password, salt, email, language]);
    }

    private async userExists(userName: string): Promise<boolean> {
        const query: string = "SELECT * FROM users where userName=?";
        const rows: ILogin[] = await MysqlConnection.instance.query(query, [userName]);
        return rows.length > 0;
    }
}

