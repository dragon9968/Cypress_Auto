import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeToolsDialogComponent } from './node-tools-dialog.component';

describe('NodeToolsDialogComponent', () => {
  let component: NodeToolsDialogComponent;
  let fixture: ComponentFixture<NodeToolsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeToolsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeToolsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
