import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Peer from 'peerjs';

@Component({
  selector: 'app-call-place',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './call-place.component.html',
  styleUrl: './call-place.component.css'
})

export class CallPlaceComponent implements OnInit {
  id:string = "";
  remoteId:string="";
  isCameraOn:boolean=false;
  public peer = new Peer();
  public currentStream:any ;
  public remoteStream:any;

  @ViewChild('currentUser') currentUser :ElementRef | undefined;
  @ViewChild('remoteUser') remoteUser :ElementRef | undefined;

  ngOnInit(): void {
    this.peer.on('open', (id:string)=> {
      console.log('My peer ID is: ' + id);
      this.id = id;
      });

      this.peer.on('call', (call)=> {
        // Answer the call, providing our mediaStream
        call.answer(this.currentStream);

        call.on('stream',(rmstream:any)=> {

          navigator.mediaDevices
       .getUserMedia({audio: true,video: { width: 400, height: 397 }})
       .then((mediaStream) => {
        this.remoteStream = rmstream;
        console.log(this.remoteStream);

        if(this.remoteUser && this.remoteUser.nativeElement)
        {
          this.remoteUser.nativeElement.srcObject = this.remoteStream;
        }
      });
          });

        });
  }

  openCamera()
  {
    this.isCameraOn = !this.isCameraOn;

    navigator.mediaDevices
   .getUserMedia({audio: true,video: { width: 400, height: 397 }})
   .then((mediaStream) => {
    this.currentStream = mediaStream;
    if(this.currentUser && this.currentUser.nativeElement)
    {
      this.currentUser.nativeElement.srcObject = this.currentStream;
    }
  })
  }

  callFriend()
  {
    var call = this.peer.call(this.remoteId,this.currentStream);
    // var conn = this.peer.connect(this.remoteId);

    call.on('stream',(rmstream:any)=> {

      navigator.mediaDevices
   .getUserMedia({audio: true,video: { width: 400, height: 397 }})
   .then((mediaStream) => {
    this.remoteStream = rmstream;
    console.log(this.remoteStream);

    if(this.remoteUser && this.remoteUser.nativeElement)
    {
      this.remoteUser.nativeElement.srcObject = this.remoteStream;
    }
  });
      });

  }
  onCopy()
  {
    navigator.clipboard.writeText(this.id);
  }
}
