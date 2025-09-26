import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { positionOptions } from '../../../../core/constants/positions';
import { UiService } from '../../../../services/ui.service';
import { Subject } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AgenceTableComponent } from '../../components/agence-table/agence-table.component';

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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgenceTableComponent,
    MATERIAL_MODULES,
  ],
  templateUrl: './agence.component.html',
  styleUrl: './agence.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AgenceComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // Date range picker
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  consultors = new FormControl('');

  cols: string[] = [
    'Período',
    'Receita Líquida',
    'Custo Fixo',
    'Comissão',
    'Lucro',
  ];
  sortables: string[] = [
    'Período',
    'Receita Líquida',
    'Custo Fixo',
    'Comissão',
    'Lucro',
  ];

  tableData = signal<any[]>([]);

  names: string[] = [
    'Aline Chastel Lima',
    'Ana Paula Fontes Martins Chiodaro',
    'Bruno Sousa Freitas',
    'Carlos Cezar Girão de Arruda',
    'Carlos Flávio Girão de Arruda',
    'Carlos Henrique de Carvalho Filho',
    'Felipe Chahad',
    'Renato Marcus Pereira',
    'Silvio Marães Ferreira',
  ];

  positionOptions = positionOptions;

  isIcon: boolean = false;
  actionIconNames = [
    // 'attachment-circle',
    'calendar',
    'clean',
    'copy-01',
    'delete-02',
    'file-attachment',
    'pencil-edit-02',
    'plus',
  ];

  constructor(private _uiService: UiService) {}

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Registering Huge Icons
    this._uiService.registerSvgIcons(this.actionIconNames);
    this.isIcon = true;

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
   * On Destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
