import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectInterfaceToPgDialogComponent } from './connect-interface-to-pg-dialog.component';

describe('CMConnectDialogComponent', () => {
  let component: ConnectInterfaceToPgDialogComponent;
  let fixture: ComponentFixture<ConnectInterfaceToPgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectInterfaceToPgDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectInterfaceToPgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
