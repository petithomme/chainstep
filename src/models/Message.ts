export class Message {

    public message: string;
    public username: string;
    public language: string;

    constructor(message: string, userName: string, language: string) {
        this.message = message;
        this.username = userName;
        this.language = language;
    }
}
