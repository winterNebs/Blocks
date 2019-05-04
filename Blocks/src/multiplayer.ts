//import { io } from "./socketio/socket.io";
//
//export class Client {
//    private _socket;
//    public constructor() {
//        this._socket = io("http://localhost:1337");
//    }
//
//    //public send(message: Message): void {
//    //    this._socket.emit('message', message);
//    //}
//    //
//    //public onMessage(): Observable<Message> {
//    //    return new Observable<Message>(observer => {
//    //        this._socket.on('message', (data: Message) => observer.next(data));
//    //    });
//    //}
//    //
//    //public onEvent(event: Event): Observable<any> {
//    //    return new Observable<Event>(observer => {
//    //        this._socket.on(event, () => observer.next());
//    //    });
//    //}
//}