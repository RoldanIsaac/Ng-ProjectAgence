import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-nothing-here',
  imports: [],
  templateUrl: './nothing-here.component.html',
  styleUrl: './nothing-here.component.css',
})
export class NothingHereComponent {
  @Input() title: string = 'Sorry!';
  subtitle: string = 'Nothing here!';
}
