import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit{
//FormGroup: This is a class from Angular’s Reactive Forms module used to manage a group of form controls.
//non-null assertion operator which means "joinRoomForm" will get value later and should not be considered null or undefined.
joinRoomForm!: FormGroup; 

//fb an instance of the formbuilder used to create FormGroup and FormControl instances
fb = inject(FormBuilder);

//Inject a router to move onto the another page
router = inject(Router);

//Inject the chatService
chatService = inject(ChatService);

ngOnInit(): void {
  this.joinRoomForm = this.fb.group({
    user: ['', Validators.required],
    room: ['', Validators.required]
  });
}

joinRoom(){
  const {user , room} = this.joinRoomForm.value;
  sessionStorage.setItem("user",user);
  sessionStorage.setItem("room",room);
  this.chatService.joinRoom(user, room)
  .then(()=>{
    this.router.navigate(['chat']);
  }).catch((err)=>{
    console.log(err);
  });

}

}
