import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrCurrencyPipe } from '../../../../core/pipes/br-currency.pipe';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
];

@Component({
  selector: 'app-agence-table',
  imports: [CommonModule, BrCurrencyPipe, MATERIAL_MODULES],
  templateUrl: './agence-table.component.html',
  styleUrl: './agence-table.component.css',
})
export class AgenceTableComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);
  displayedColumns = input.required<string[]>();
  sortableColumns = input.required<string[]>();
  data = input.required<any[]>();
  dataSource = new MatTableDataSource<any>();

  constructor() {
    effect(() => {
      if (this.data()) {
        this.dataSource.data = this.data();
      }
    });
  }

  // ------------------------------------------------------------------------------------------
  // @ Lifecycle Hooks
  // ------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    this.dataSource.data = this.data();
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
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

  getTotal(column: string): number {
    const columnMap: Record<string, string> = {
      'Receita Líquida': 'receitaLiquida',
      'Custo Fixo': 'fixedSalary',
      Comissão: 'comissao',
      Lucro: 'lucro',
    };

    const field = columnMap[column];
    if (!field) return 0;

    return this.dataSource.data.reduce(
      (acc, item) => acc + (Number(item[field]) || 0),
      0
    );
  }
}
