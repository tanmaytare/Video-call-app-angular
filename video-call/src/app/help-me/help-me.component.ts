import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-me.component.html',
  styleUrl: './help-me.component.css'
})
export class HelpMeComponent {
  @Input() isVisible: boolean = false;

  close() {
    this.isVisible = false;
  }
}
