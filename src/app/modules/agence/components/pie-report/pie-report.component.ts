import { Component, Input, OnChanges } from '@angular/core';
import { ChartData } from 'chart.js';
// import { currencyBRL } from '../format.utils';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-report',
  imports: [BaseChartDirective],
  templateUrl: './pie-report.component.html',
  styleUrl: './pie-report.component.css',
})
export class PieReportComponent implements OnChanges {
  @Input() report: any[] = [];
  pieData: ChartData<'pie'> = { labels: [], datasets: [] };

  ngOnChanges() {
    const total = this.report.reduce((s, r) => s + r.receita_liquida, 0);
    const labels = this.report.map((r) => `User ${r.co_usuario}`);
    const values = this.report.map((r) =>
      Number((r.receita_liquida || 0).toFixed(2))
    );
    this.pieData = {
      labels,
      datasets: [{ data: values }],
    };
  }
}
