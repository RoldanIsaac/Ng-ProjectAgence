import { Component, input } from '@angular/core';

@Component({
  selector: 'action-btn',
  imports: [],
  templateUrl: './action-btn.component.html',
  styleUrl: './action-btn.component.css',
})
export class ActionBtnComponent {
  label = input.required<string>();
}
