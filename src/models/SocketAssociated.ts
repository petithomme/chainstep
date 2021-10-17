import {User} from "./User";
import * as WebSocket from 'ws';

export class SocketAssociated {

    public user: User;
    public socket: WebSocket;

    constructor(user: User, socket: WebSocket) {
        this.user = user;
        this.socket = socket;
    }

}
