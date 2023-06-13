import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupFeaturesComponent } from './lookup-features.component';

describe('LookupFeaturesComponent', () => {
  let component: LookupFeaturesComponent;
  let fixture: ComponentFixture<LookupFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
