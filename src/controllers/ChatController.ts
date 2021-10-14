import * as WebSocket from 'ws';
import {RawData, WebSocketServer} from 'ws';

export class ChatController {

    private messages: string[] = [];

    public createChatsServer(): void {
        const wss = new WebSocketServer({
            port: 5001, perMessageDeflate: false
        });
        wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (message: RawData) => {
                const messageAsString: string = message.toString();
                this.messages.push(messageAsString);
                wss.clients.forEach((client) => {
                   client.send(JSON.stringify({message : messageAsString}));
                });
            });
            ws.send(JSON.stringify({messages: this.messages}));
        });
    }

}
