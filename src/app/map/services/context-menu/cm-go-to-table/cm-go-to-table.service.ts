import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CMGoToTableService {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    ) { }

  getMenu() {
    return {
      id: "go_to_table",
      content: "Go to table",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        const target = event.target;
        const data = target.data()
        let url = null
        if (data.node_id != undefined) {
          url = '/nodeview/show/' + data.node_id;
        } else if (data.pg_id != undefined) {
          url = '/portgroupview/show/' + data.pg_id;
        } else if (data.interface_id != undefined) {
          url = '/interfaceview/show/' + data.interface_id;
        }
        if (url != null) {
          this.router.navigateByUrl(url);
        } else {
          this.toastr.warning('Table not accessible');
        }
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
