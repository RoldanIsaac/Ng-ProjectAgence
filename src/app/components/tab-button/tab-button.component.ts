import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-button',
  imports: [CommonModule],
  templateUrl: './tab-button.component.html',
  styleUrl: './tab-button.component.css',
})
export class TabButtonComponent {
  @Input() label!: string;
  @Input() isSelected: boolean = false;

  @Output() onClickEmit = new EventEmitter<string>();

  onClick() {
    this.onClickEmit.emit(this.label);
  }
}
