import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'action-btn',
  imports: [CommonModule],
  templateUrl: './action-btn.component.html',
  styleUrl: './action-btn.component.css',
})
export class ActionBtnComponent {
  label = input.required<string>();
  @Output() onClickEmit = new EventEmitter<string>();

  constructor() {}

  onClick() {
    this.onClickEmit.emit();
  }
}
