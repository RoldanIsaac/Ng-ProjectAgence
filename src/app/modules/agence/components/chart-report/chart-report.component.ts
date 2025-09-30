import { Component, input, effect } from '@angular/core';
import {
  HighchartsChartComponent,
  ChartConstructorType,
} from 'highcharts-angular';
import * as Highcharts from 'highcharts';

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
  data = input.required<any>();

  chartOptions: Highcharts.Options = {
    title: {
      text: 'Performance Comercial',
    },
    xAxis: {
      categories: [], // will be dynamically filled with consultant names
      title: {
        text: 'Consultants',
      },
    },
    yAxis: {
      min: 0,
      max: 32000, // fixed value to keep axes consistent
      title: {
        text: 'Net Revenue',
      },
      plotLines: [], // average fixed cost line will be added here
    },
    series: [
      {
        type: 'column', // vertical bars
        name: 'Net Revenue',
        data: [],
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true, // show values on top of bars
        },
      },
    },
  };

  chartConstructor: ChartConstructorType = 'chart';
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;

  constructor() {
    effect(() => {
      if (this.data()) {
        console.log('Received data:', this.data());

        // Extract consultant names for X axis
        const categories = this.data().map(
          (item: any) => item.consultor.no_usuario
        );

        // Calculate net revenue for each consultant
        const receitas = this.data().map((item: any) => {
          const valor = item.info[0]?.VALOR ?? 0;
          const impostos = item.info[0]?.TOTAL_IMP_INC ?? 0; // percentage of taxes
          return valor - (valor * impostos) / 100;
        });

        // Calculate average fixed cost (mean of BRUT_SALARIO)
        const salarios = this.data().map(
          (item: any) => item.info[0]?.BRUT_SALARIO ?? 0
        );
        const custoFixoMedio =
          salarios.reduce((sum: number, s: number) => sum + s, 0) /
          (salarios.length || 1);

        // Update X axis categories
        this.chartOptions.xAxis = {
          ...this.chartOptions.xAxis,
          categories,
        };

        // Update bar series with net revenues
        (this.chartOptions.series as Highcharts.SeriesOptionsType[])[0] = {
          type: 'column',
          name: 'Net Revenue',
          data: receitas,
        };

        // Add a horizontal line for average fixed cost
        this.chartOptions.yAxis = {
          ...this.chartOptions.yAxis,
          max: 32000, // fixed to keep consistency
          plotLines: [
            {
              value: custoFixoMedio,
              color: 'red',
              dashStyle: 'Dash',
              width: 2,
              label: {
                text: `Average Fixed Cost: ${custoFixoMedio.toFixed(2)}`,
                align: 'right',
                style: {
                  color: 'red',
                  fontWeight: 'bold',
                },
              },
            },
          ],
        };

        // Force chart to update
        this.updateFlag = true;
      }
    });
  }
}
