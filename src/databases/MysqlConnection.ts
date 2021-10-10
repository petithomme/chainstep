import {Connection} from "mysql2/promise";
const mysql = require('mysql2/promise');

export class MysqlConnection {

    private static _instance: MysqlConnection;

    public mySqlConnection!: Connection;

    public static get instance(): MysqlConnection {
        if (!MysqlConnection._instance) {
            MysqlConnection._instance = new MysqlConnection();
        }
        return MysqlConnection._instance;
    }

    public async init(): Promise<void> {
        this.mySqlConnection = await mysql.createConnection({
            host: "localhost",
            user: "chainstep",
            password: "chainstep",
            database : "chainstep"});
    }

    public async query(query: string, params: (string|number)[]): Promise<any> {
        const result = await this.mySqlConnection.execute(query, params);
        return result ? result[0] : [];
    }
}
