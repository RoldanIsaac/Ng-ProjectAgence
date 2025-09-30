import { Component, effect, input } from '@angular/core';
import {
  HighchartsChartComponent,
  ChartConstructorType,
} from 'highcharts-angular';
import * as Highcharts from 'highcharts';

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
  data = input.required<any>();

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Participacao na Receita Liquida',
    },
    series: [
      {
        type: 'pie',
        data: [], // starts empty
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}',
        },
      },
    ],
  };

  chartConstructor: ChartConstructorType = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;

  constructor() {
    effect(() => {
      if (this.data()) {
        // Tranform data
        const seriesData = this.data().map((item: any) => ({
          name: item.consultor.no_usuario,
          y: item.info[0]?.receitaLiquida ?? 0,
        }));

        // Update chart options
        (this.chartOptions.series as Highcharts.SeriesOptionsType[])[0] = {
          type: 'pie',
          data: seriesData,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
          },
        };

        // Force update
        this.updateFlag = true;
      }
    });
  }
}
