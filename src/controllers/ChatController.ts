import * as WebSocket from 'ws';
import {RawData, WebSocketServer} from 'ws';
import {Cache} from "../cache/Cache";
import axios from "axios";
import {IncomingMessage} from "http";
import {SocketAssociated} from "../models/SocketAssociated";
import {User} from "../models/User";
import {Message} from "../models/Message";

export class ChatController {

    private messages: Message[] = [];
    private wss: WebSocketServer;
    private clients: object = {};

    constructor() {
        this.wss = new WebSocketServer({
            port: 5001, perMessageDeflate: false
        });
        this.wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {

            if (request.url) {
                const url: URL = new URL(request.headers.origin+request.url);
                const userName: string = <string>url.searchParams.get('userName');
                const token: string = <string>url.searchParams.get('token');
                const cached: User = Cache.instance.get(userName);
                if (token == cached.sessionToken) {
                    this.clients[userName] = new SocketAssociated(cached, ws);
                    ws.on('message', (data: RawData) => {
                        const obj = JSON.parse(data.toString());
                        this.forwardMessage(`${obj['userName']}`, `${obj['message']}`, cached.language);
                        //
                    });
                    // send all messages so far
                    const messages: string[] = await this.getAllMessagesHistory(cached.language, this.messages);
                    ws.send(JSON.stringify({messages: messages}));
                }
            }
        });
    }

    private async getAllMessagesHistory(targetLanguage: string, messages: Message[]): Promise<string[]> {
        const result: string[] = [];
        for (const message of messages) {
            const traduction: string = await this.translateMessage(message.message, message.language, targetLanguage);
            result.push(`${message.username} : ${traduction}`);
        };
        return result;
    }

    private async translateMessage(message: string, baseLanguage: string, targetLanguage: string): Promise<string> {
        return await this.translate(message, baseLanguage, targetLanguage);
    }

    private async forwardMessage(userName: string, message: string, baseLanguage: string): Promise<void> {
        const translations: object = {};
        this.messages.push(new Message(message, userName, baseLanguage));

        Object.entries(this.clients).forEach( async ([key, value]) => {
                const sa: SocketAssociated = value;
                if (!translations[sa.user.language]) {
                    translations[sa.user.language] = await this.translateMessage(message, baseLanguage, sa.user.language);
                }
                sa.socket.send(JSON.stringify({message : `${userName} : ${translations[sa.user.language]}`}));
            }
        );
    }

    private async translate(base: string, source: string, target: string): Promise<string> {
        const data = {
            q : base,
            source,
            target
        }
        const result: object = await axios.post("http://localhost:6000/translate", data);
        return result['data'].translatedText;
    }

}
