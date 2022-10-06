import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConnectDialogComponent } from './server-connect-dialog.component';

describe('ServerConnectDialogComponent', () => {
  let component: ServerConnectDialogComponent;
  let fixture: ComponentFixture<ServerConnectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerConnectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
