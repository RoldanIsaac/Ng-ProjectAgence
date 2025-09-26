import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { currencyBRL } from '../../../../core/utils/formatters';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-report',
  imports: [BaseChartDirective, NgCharts],
  templateUrl: './chart-report.component.html',
  styleUrl: './chart-report.component.css',
})
export class ChartReportComponent implements OnChanges {
  @Input() report: any[] = [];
  @Input() custoFixoMedio = 0;

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions = {};

  ngOnChanges() {
    const labels = this.report.map((r) => `User ${r.co_usuario}`);
    const receita = this.report.map((r) =>
      Number(r.receita_liquida.toFixed(2))
    );
    const custoMedioArray = this.report.map(() =>
      Number(this.custoFixoMedio.toFixed(2))
    );

    this.chartData = {
      labels,
      datasets: [
        { type: 'bar', label: 'Receita Líquida', data: receita },
        {
          type: 'line',
          label: 'Custo Fixo Médio',
          data: custoMedioArray,
          fill: false,
        },
      ] as any,
    };

    // fijar ejes máximos iguales (ejemplo: 32000) -> idealmente dinámico
    const max = Math.max(...receita, this.custoFixoMedio) * 1.1 || 32000;
    const roundedMax = Math.ceil(max / 1000) * 1000;

    this.chartOptions = {
      responsive: true,
      scales: {
        y: { suggestedMax: roundedMax },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.raw);
              return `${ctx.dataset.label}: ${currencyBRL(v)}`;
            },
          },
        },
      },
    };
  }
}
