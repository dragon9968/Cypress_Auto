import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashBinProjectComponent } from './trash-bin-project.component';

describe('TrashBinProjectComponent', () => {
  let component: TrashBinProjectComponent;
  let fixture: ComponentFixture<TrashBinProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashBinProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrashBinProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
