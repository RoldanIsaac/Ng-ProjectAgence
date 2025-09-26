import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButtonModule,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { positionOptions } from '../../../../core/constants/positions';
import { UiService } from '../../../../services/ui.service';
import { Subject, take } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AgenceTableComponent } from '../../components/agence-table/agence-table.component';
import { ActionBtnComponent } from '../../../../components/action-btn/action-btn.component';
import { ReportService } from '../../../../report.service';
import { ChartReportComponent } from '../../components/chart-report/chart-report.component';
import { PieReportComponent } from '../../components/pie-report/pie-report.component';
import { cols, sortables } from '../../../../core/constants/tables';
import { TabButtonComponent } from '../../../../components/tab-button/tab-button.component';
import { MockDataService } from '../../../../api/mock-data.service';

const MATERIAL_MODULES = [
  MatSelectModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatFabButton,
  MatIconButton,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatFormField,
  MatLabel,
  MatInput,
  MatInputModule,
  MatFormFieldModule,
  MatButtonToggleModule,
];

@Component({
  selector: 'app-agence',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgenceTableComponent,
    ActionBtnComponent,
    ChartReportComponent,
    PieReportComponent,
    TabButtonComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AgenceComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Tabs
  selectedTab = signal<string>('consultor');
  tabs = [
    { value: 'consultor', label: 'Por Consultor' },
    { value: 'client', label: 'Por Cliente' },
  ];

  // Table features
  tableCols = cols;
  tableSortables = sortables;
  tableData = signal<any[]>([
    {
      periodo: '',
    },
  ]);

  // Flags
  isGenerated = signal<boolean>(false);
  isTableMode = signal<boolean>(true);
  isChartMode = signal<boolean>(false);
  isPieMode = signal<boolean>(false);

  // Report modes
  modes = ['Relatório', 'Gráfico', 'Pizza'];

  // Forms
  // Date range picker
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  consultors = new FormControl('');

  consultants = signal<string[]>([]);
  selectedConsultants = signal<string[]>([]);

  // UI Features
  positionOptions = positionOptions;

  constructor(
    private reportService: ReportService,
    private mockService: MockDataService
  ) {}

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.dateRangeSubscriptions();
    this.getConsultants();
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // ------------------------------------------------------------------------------------------
  // @ Public Methods
  // ------------------------------------------------------------------------------------------

  /**
   *
   */
  dateRangeSubscriptions(): void {
    this.range.valueChanges.subscribe((values) => {
      if (values.start && values.end) {
        // this.dateRangeEmit.emit({
        //   startDate: format(values.start, 'yyyy-MM-dd'),
        //   endDate: format(values.end, 'yyyy-MM-dd'),
        // });
      }
    });
  }

  /**
   * @description
   * Fetching consultants
   */
  getConsultants(): void {
    // this.reportService
    //   .getConsultants()
    //   .subscribe((cs) => (this.consultants = cs as any));

    this.mockService
      .getUsuariosConSistemaFiltrado()
      .pipe(take(1))
      .subscribe({
        next: (consultants) => {
          this.consultants.set(
            consultants.map((c) => c.no_usuario) as string[]
          );
        },
        error: (err) => {
          console.error('Error fetching consultants:', err);
        },
      });
  }

  // ------------------------------------------------------------------------------------------
  // @ Action Methods
  // ------------------------------------------------------------------------------------------

  /**
   *
   */
  onSelectConsultor(event: MatSelectChange): void {
    const filterValue = event.value;
    this.selectedConsultants.set(filterValue);
  }

  /**
   *
   */
  onGerarRelatorio(mode: string) {
    this.isGenerated.set(true);

    // Setting modes
    this.isTableMode.set(mode === 'Relatório');
    this.isChartMode.set(mode === 'Gráfico');
    this.isPieMode.set(mode === 'Pizza');

    // Generating report

    // this.reportService
    //   .generateReportForMonth(this.selectedConsultants(), this.month, this.year)
    //   .subscribe((res) => {
    //     // this.report = res.report;
    //     // this.custoFixoMedio = res.custoFixoMedio;
    //   });
  }
}
