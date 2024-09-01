import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection: signalR.HubConnection = new signalR.HubConnectionBuilder()//create a property & the URL is backend URL
    .withUrl("http://localhost:5000/chat")
    .configureLogging(signalR.LogLevel.Information) //For enabling the logging information
    .build();
    
    public messages$ = new BehaviorSubject<any>([]); //To store all the messages create a behaviour subject property(one kind of the observer)
    public connectedUsers$ = new BehaviorSubject<string[]>([]);
    public messages: any[] = [];
    public users: string[] = []; 

  constructor() { 
    this.start();//First Start the Connection
    this.connection.on("ReceiveMessage",(user: string, message: string, messageTime: string) => {//whenever someone joins that time 'ReceiveMessage events trigger'
      this.messages = [...this.messages, {user, message, messageTime} ];// ...this.messages is for previous, I mean act as a concatenation
      this.messages$.next(this.messages);//make updated with the latest data
    });

    //Trigger or you can listen the sendAsync events here
    this.connection.on("ConnectedUser", (users: any) => {
      this.connectedUsers$.next(users);
    });
  }
  //start the connection
  public async start() {
    try {
      await this.connection.start();
      console.log("Connection is established!");
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        this.start();
      }, 5000);
    }
  }

  //join room
  public async joinRoom(user: string, room: string) {
    return this.connection.invoke("JoinRoom", { user, room }); //invoke a method which is already a path of your backend/defined on your backend
  }

  //send messages
  public async sendMessage(message: string){
    return this.connection.invoke("SendMessage",message)
  }

  //leave chat/group
  public async leaveChat(){
    return this.connection.stop();
  }
}
