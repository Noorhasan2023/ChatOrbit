import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  chatService = inject(ChatService);//this is for getting the data from the chatservice
  router = inject(Router);
  
  inputMessage = "";
  messages: any[] = [];
  loggedInUserName = sessionStorage.getItem("user");
  roomName = sessionStorage.getItem("room");
  //If the chat is more
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    //whenever any new message will add this will trigger
    this.chatService.messages$.subscribe(res => {
      this.messages = res;
      console.log(this.messages);
    });
  }
  //if there's the scroll then always scroll to bottom
  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)//send the message which is typed by the user
    .then(()=>{
      this.inputMessage = ''; //once mssg sent successfully then refresh the variable
    }).catch((err)=>{
      console.log(err);
    });
  }

  leaveChat(){
    this.chatService.leaveChat()
    .then(()=>{
      this.router.navigate(['welcome']);
      setTimeout(() => {
        location.reload();
      }, 0);
    }).catch((err)=>{
      console.log(err);
    });
  }
}
