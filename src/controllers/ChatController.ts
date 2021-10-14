import * as WebSocket from 'ws';
import {RawData, WebSocketServer} from 'ws';

export class ChatController {

    private messages: string[] = [];
    private wss: WebSocketServer;

    constructor() {
        this.wss = new WebSocketServer({
            port: 5001, perMessageDeflate: false
        });
        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (message: RawData) => {
                this.forwardMessage(message.toString());
            });
            // send all messages so far
            ws.send(JSON.stringify({messages: this.messages}));
        });
    }

    private forwardMessage(message: string): void {
        this.messages.push(message);
        this.wss.clients.forEach((client) => {
            client.send(JSON.stringify({message : message}));
        });
    }

}
