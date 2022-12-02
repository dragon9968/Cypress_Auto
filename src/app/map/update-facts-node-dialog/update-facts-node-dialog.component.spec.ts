import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFactsNodeDialogComponent } from './update-facts-node-dialog.component';

describe('UpdateFactsNodeDialogComponent', () => {
  let component: UpdateFactsNodeDialogComponent;
  let fixture: ComponentFixture<UpdateFactsNodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFactsNodeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFactsNodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
