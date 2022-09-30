import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent, PaginationValue } from '../pagination/pagination.component';
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
export interface Columns {
  title: string;
  dataProperty: string;
}
export interface RowActions {
  label: string;
  actionIdToReturn: string;
  icon: string;
}
export interface DataTableType {
  columns: Columns[];
  rowActions: RowActions[];
}

@Component({
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule, ReactiveFormsModule],
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableContent: any[] = [];
  @Input()
  tableConfig!: DataTableType;
  @Output() startRowAction = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onRowClicked = new EventEmitter<any>();

  public pagination: PaginationValue = { page: 1, pageSize: 10 };

  public readonly paginationControl = new FormControl(this.pagination);

  public visibleItems!: PaginatedResponse<any>;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableContent']) {
      if (!changes['tableContent'].firstChange) {
        this.onPageChange({
          page: this.paginationControl.value?.page ? this.paginationControl.value?.page : 1,
          pageSize: this.paginationControl.value?.pageSize?this.paginationControl.value?.pageSize:1,
        });
      }
    }
  }
  ngOnInit(): void {
    this.visibleItems = {
      items: this.tableContent.slice(0, 10),
      total: this.tableContent.length,
    };
    this.paginationControl.valueChanges.subscribe(() => {
      this.onPageChange({
        page: this.paginationControl.value?.page ? this.paginationControl.value?.page : 0,
        pageSize: this.paginationControl.value?.pageSize ? this.paginationControl.value?.pageSize : 0,
      });
    });
  }

  public onPageChange(pagination: PaginationValue): void {
    const startIndex =
      pagination.page && pagination.pageSize ? (pagination.page - 1) * pagination.pageSize : 0;

    const items = this.tableContent.slice(
      startIndex,
      startIndex + (pagination.pageSize ? pagination.pageSize : 0),
    );

    this.visibleItems = { items, total: this.tableContent.length };
  }
  public onRowActionClicked(actionType: string, rowData: any): void {
    const userAction = {
      actionToPerform: actionType,
      rowData: rowData,
    };

    this.startRowAction.emit(userAction);
  }
  public onRowClickedEvent( rowData: any): void {

    this.onRowClicked.emit(rowData);
  }
}
