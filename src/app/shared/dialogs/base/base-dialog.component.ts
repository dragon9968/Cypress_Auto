import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss'],
})
export class BaseDialogComponent implements OnInit {
  @Input() header: string | undefined;
  @Input() showClose = true;
  @Output() closeClick = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onCloseClick() {
    this.closeClick.next();
  }
}
