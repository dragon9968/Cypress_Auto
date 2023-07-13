import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouteSegments } from "../../core/enums/route-segments.enum";
import { AgGridAngular } from "ag-grid-angular";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { Observable, of, Subscription } from "rxjs";
import { HistoryService } from "../../core/services/history/history.service";
import { Store } from "@ngrx/store";
import { selectHistories } from "../../store/history/history.selectors";
import { retrievedHistories } from "../../store/history/history.actions";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  selectHistories$ = new Subscription()
  histories: any[] = []
  quickFilterValue = '';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  routeSegments = RouteSegments;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  rowData$!: Observable<any[]>;
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    { field: 'task'},
    {
      field: 'category',
      suppressSizeToFit: true,
    },
    {
      field: 'date_time',
      headerName: 'Date Time',
      cellRenderer: (dateTime: any) => new Date(dateTime.value).toLocaleString(),
    },
    { field: 'item_id', headerName: 'Item Id'},
    { field: 'user_id', headerName: 'User Id'},
  ];
  constructor(
    private store: Store,
    private historyService: HistoryService
  ) {
    this.store.select(selectHistories).subscribe(histories => {
      if (histories) {
        if (this.gridApi) {
          this.gridApi.setRowData(histories)
        } else {
          this.rowData$ = of(histories)
        }
      }
    })
  }

  ngOnInit(): void {
    this.historyService.getAll().subscribe(res => {
     this.store.dispatch(retrievedHistories({data: res.result}))
    })
  }

  ngOnDestroy(): void {
    this.selectHistories$.unsubscribe()
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }
}
