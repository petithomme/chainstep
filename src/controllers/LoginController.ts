import bcrypt from 'bcrypt';
import {MysqlConnection} from "../databases/MysqlConnection";
import {ILogin} from "../interfaces/ILogin";

export class LoginController {

    public async login(username: string, password: string): Promise<void> {
        const query: string = "SELECT * from users where userName =?";
        const result: ILogin[] = await MysqlConnection.instance.query(query, [username]);
        if (result.length == 1) {
            const hash: string = bcrypt.hashSync(password, result[0].salt)
            const loggedIn: boolean = bcrypt.compareSync(result[0].password, hash);
        } else {
            throw Error("login : more than 1 record");
        }
    }

    public async createUser(username: string, password: string, email: string): Promise<void> {
        const exist: boolean = await this.userExists(username);
        if (exist) {
            // todo add popup
        } else {
            const salt: string = await bcrypt.genSalt(10);
            await this.insertUser(username, password, salt, email);
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

