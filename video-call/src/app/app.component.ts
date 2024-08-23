import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CallPlaceComponent } from "./call-place/call-place.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CallPlaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'video-call';
  

}
