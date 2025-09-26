import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { UiService } from '../../../../services/ui.service';
import { positionOptions } from '../../../../core/constants/positions';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agence-table',
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './agence-table.component.html',
  styleUrl: './agence-table.component.css',
})
export class AgenceTableComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);

  displayedColumns = input.required<string[]>();
  ridesTotalColumns = signal<string[]>([]);
  sortableColumns = input.required<string[]>();

  data = input.required<any[]>();
  dataSource = new MatTableDataSource<any>();

  isIcon: boolean = false;
  actionIconNames = [
    'delete-02',
    'dollar-circle',
    'file-attachment',
    'note',
    'pencil-edit-02',
  ];

  positionOptions = positionOptions;

  constructor(private uiService: UiService) {
    effect(
      () => {
        if (this.data()) {
          this.dataSource.data = this.data();
        }
      },
      { allowSignalWrites: true }
    );
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

    // Registering Huge Icons
    this.uiService.registerSvgIcons(this.actionIconNames);
    this.isIcon = true;
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

  uiColumnNames(columnString: string) {}
}
