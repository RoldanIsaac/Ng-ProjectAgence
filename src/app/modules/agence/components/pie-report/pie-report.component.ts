import { Component, effect, input } from '@angular/core';
import {
  HighchartsChartComponent,
  ChartConstructorType,
} from 'highcharts-angular';

@Component({
  selector: 'app-pie-report',
  imports: [HighchartsChartComponent],
  template: `
    <highcharts-chart
      [constructorType]="chartConstructor"
      [options]="chartOptions"
      [(update)]="updateFlag"
      [oneToOne]="oneToOneFlag"
      class="chart"
    />
  `,
  styleUrl: './pie-report.component.css',
})
export class PieReportComponent {
  data = input.required<any[]>();

  constructor() {
    effect(() => {
      if (this.data()) {
        console.log(this.data());
      }
    });
  }

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Participacao na Receita Liquida',
    },
    series: [
      {
        data: [
          { name: 'Carlos Flavio Girao de Arruda', y: 5 },
          { name: 'Mario Silvestri Filho', y: 4 },
          { name: 'Carlos Henrique de Carvalho', y: 1 },
        ],
        dataLabels: {
          enabled: true, // activa las etiquetas
          format: '{point.name}: {point.y}', // formato de la etiqueta
        },

        type: 'pie',
      },
    ],
  };
  chartConstructor: ChartConstructorType = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
}
