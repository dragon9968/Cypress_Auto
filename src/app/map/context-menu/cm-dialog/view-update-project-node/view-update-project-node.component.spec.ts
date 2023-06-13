import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateProjectNodeComponent } from './view-update-project-node.component';

describe('ViewUpdateProjectNodeComponent', () => {
  let component: ViewUpdateProjectNodeComponent;
  let fixture: ComponentFixture<ViewUpdateProjectNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUpdateProjectNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUpdateProjectNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
