import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Peer from 'peerjs';

@Component({
  selector: 'app-call-place',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './call-place.component.html',
  styleUrls: ['./call-place.component.css']
})
export class CallPlaceComponent implements OnInit {
  id: string = "";
  remoteId: string = "";
  isCameraOn: boolean = false;
  public peer = new Peer();
  public currentStream: any;
  public remoteStream: any;
  private currentPeer: any;

  @ViewChild('currentUser') currentUser: ElementRef | undefined;
  @ViewChild('remoteUser') remoteUser: ElementRef | undefined;

  ngOnInit(): void {
    this.peer.on('open', (id: string) => {
      console.log('My peer ID is: ' + id);
      this.id = id;
    });

    this.peer.on('call', (call) => {
      this.currentPeer = call;
      call.answer(this.currentStream);
      call.on('stream', (rmstream: any) => {
        this.remoteStream = rmstream;
        if (this.remoteUser && this.remoteUser.nativeElement) {
          this.remoteUser.nativeElement.srcObject = this.remoteStream;
        }
      });
    });
  }

  openCamera() {
    this.isCameraOn = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: { width: 400, height: 397 } })
      .then((mediaStream) => {
        this.currentStream = mediaStream;
        this.updateLocalVideoStream();
        this.updateRemoteStream();
      });
  }

  callFriend() {
    if (!this.currentStream) {
      alert('Please turn on your camera first!');
      return;
    }

    const call = this.peer.call(this.remoteId, this.currentStream);
    this.currentPeer = call;
    call.on('stream', (rmstream: any) => {
      this.remoteStream = rmstream;
      if (this.remoteUser && this.remoteUser.nativeElement) {
        this.remoteUser.nativeElement.srcObject = this.remoteStream;
      }
    });
  }

  onCopy() {
    navigator.clipboard.writeText(this.id);
  }

  shareScreen() {
    navigator.mediaDevices.getDisplayMedia({
      video: { width: 600, height: 800 },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      this.currentStream = stream;
      this.updateLocalVideoStream();
      this.updateRemoteStream();

      stream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare();
      };
    }).catch(err => {
      console.log('Unable to get display media: ' + err);
    });
  }

  stopScreenShare() {
    this.openCamera();
  }

  updateLocalVideoStream() {
    if (this.currentUser && this.currentUser.nativeElement) {
      this.currentUser.nativeElement.srcObject = this.currentStream;
    }
  }

  updateRemoteStream() {
    if (this.currentPeer) {
      this.currentPeer.peerConnection.getSenders().forEach((sender: any) => {
        if (sender.track.kind === 'video') {
          const videoTrack = this.currentStream.getVideoTracks()[0];
          sender.replaceTrack(videoTrack);
        }
      });
    }
  }

  endCall() {
    if (this.currentStream) {
      // Stop all tracks of the current stream
      this.currentStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }

    if (this.currentPeer) {
      // Close the current peer connection
      this.currentPeer.close();
      this.currentPeer = null;
    }

    // Reset video elements
    if (this.currentUser && this.currentUser.nativeElement) {
      this.currentUser.nativeElement.srcObject = null;
    }

    if (this.remoteUser && this.remoteUser.nativeElement) {
      this.remoteUser.nativeElement.srcObject = null;
    }

    // Reset state
    this.currentStream = null;
    this.remoteStream = null;
    this.isCameraOn = false;
    this.remoteId = "";
  }

}
