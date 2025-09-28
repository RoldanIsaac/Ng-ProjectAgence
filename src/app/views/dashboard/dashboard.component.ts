import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  features = [
    'Componentes reutilizables.',
    'Navbar responsive con toggle integrado.',
    'Packages: Highcharts. Material. Date-fns',
  ];
}
