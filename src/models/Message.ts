export class Message {
    private message: string;
    private username: string;
    private language: string;

    constructor(message: string, userName: string, language: string) {
        this.message = message;
        this.username = userName;
        this.language = language;
    }
}
