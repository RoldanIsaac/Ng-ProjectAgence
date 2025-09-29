import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { positionOptions } from '../../../../core/constants/positions';
import { Subject, take } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AgenceTableComponent } from '../../components/agence-table/agence-table.component';
import { ActionBtnComponent } from '../../../../components/action-btn/action-btn.component';
import { ChartReportComponent } from '../../components/chart-report/chart-report.component';
import { PieReportComponent } from '../../components/pie-report/pie-report.component';
import { cols, sortables } from '../../../../core/constants/tables';
import { TabButtonComponent } from '../../../../components/tab-button/tab-button.component';
import { format } from 'date-fns';
import { dateFormatBr } from '../../../../core/constants/date';
import { DateRange } from '../../../../core/interfaces/date';
import { tabs } from '../../../../core/constants/tabs';
import { ReportService } from '../../../../services/report.service';

const MATERIAL_MODULES = [
  MatSelectModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatButtonModule,
  MatTableModule,
  MatFormField,
  MatLabel,
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
export class AgenceComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // Tabs
  tabs = tabs;
  selectedTab = signal<string>('consultor');

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

  // Forms & Filters
  consultorsFC = new FormControl('');
  consultors = signal<any[]>([]);
  selectedConsultors = signal<string[]>([]);
  // Date range picker
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dateRange = signal<DateRange>({ from: '', to: '' });

  // UI Features
  positionOptions = positionOptions;

  // Report data
  reportsData = signal<any[]>([]);

  constructor(private reportService: ReportService) {}

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  /**
   * On Init
   */
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
   * @description
   *
   */
  dateRangeSubscriptions(): void {
    this.range.valueChanges.subscribe((values) => {
      if (values.start && values.end) {
        this.dateRange.set({
          from: format(values.start, dateFormatBr),
          to: format(values.end, dateFormatBr),
        });
      }
    });
  }

  /**
   * @description
   * Fetching consultants
   */
  getConsultants(): void {
    this.reportService
      .getConsultors()
      .pipe(take(1))
      .subscribe({
        next: (consultors) => {
          // console.log(consultors)  // Debug
          if (!(consultors.data?.length > 0)) return;
          this.consultors.set(consultors.data);
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
    this.selectedConsultors.set(filterValue);
  }

  /**
   *
   */
  onGerarRelatorio(mode: string) {
    // Setting modes
    this.isTableMode.set(mode === 'Relatório');
    this.isChartMode.set(mode === 'Gráfico');
    this.isPieMode.set(mode === 'Pizza');

    // Validations
    if (this.dateRange().from === '' || this.dateRange().to === '') {
      console.warn('Date range is not set.');
      return;
    }

    if (this.selectedConsultors().length === 0) {
      console.warn('No consultors selected.');
    }

    // Generating report
    this.reportService
      .generateReport(this.selectedConsultors(), this.dateRange())
      .pipe(take(1))
      .subscribe((res) => {
        // console.log(res); // Debug
        this.reportsData.set(res.data);
        this.isGenerated.set(true);
      });
  }
}
