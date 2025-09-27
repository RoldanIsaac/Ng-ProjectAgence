import { Component } from '@angular/core';
import {
  HighchartsChartComponent,
  ChartConstructorType,
} from 'highcharts-angular';

@Component({
  selector: 'app-chart-report',
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
  styleUrl: './chart-report.component.css',
})
export class ChartReportComponent {
  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'bar',
      },
    ],
  };
  chartConstructor: ChartConstructorType = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
}
