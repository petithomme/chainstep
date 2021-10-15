import * as WebSocket from 'ws';
import {RawData, WebSocketServer} from 'ws';
import {Cache} from "../cache/Cache";

export class ChatController {

    private messages: string[] = [];
    private wss: WebSocketServer;

    constructor() {
        this.wss = new WebSocketServer({
            port: 5001, perMessageDeflate: false
        });
        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (data: RawData) => {
                const obj = JSON.parse(data.toString());
                if (Cache.instance.get(obj['userName']) === obj['token']) {
                    this.forwardMessage(`${obj['userName']} - ${obj['message']}`);
                }
                //
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
