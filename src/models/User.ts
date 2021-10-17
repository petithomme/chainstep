export class User {

    public userName: string;
    public sessionToken: string;
    public language: string;

    constructor(userName: string, sessionToken: string, language: string) {
        this.userName = userName;
        this.sessionToken = sessionToken;
        this.language = language;
    }
}
