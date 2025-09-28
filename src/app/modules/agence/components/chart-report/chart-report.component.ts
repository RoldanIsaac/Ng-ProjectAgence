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
    title: {
      text: 'Performance Comercial',
    },
    xAxis: {
      categories: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      title: {
        text: 'Meses',
      },
    },
    yAxis: {
      title: {
        text: 'Valor',
      },
    },
    series: [
      {
        type: 'bar',
        name: 'Ventas',
        data: [10, 15, 12, 20, 18, 25, 22, 17, 19, 23, 21, 30],
      },
    ],
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
  };

  chartConstructor: ChartConstructorType = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
}
