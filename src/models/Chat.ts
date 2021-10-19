import {Message} from "./Message";

export class Chat {

    private messages: Message[] = [];

    public addMessage(): void {

    }

    public getMessages(): Message[] {
        return this.messages;
    }

}
