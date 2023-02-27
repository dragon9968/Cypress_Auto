import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupNamesComponent } from './lookup-names.component';

describe('LookupNamesComponent', () => {
  let component: LookupNamesComponent;
  let fixture: ComponentFixture<LookupNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookupNamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
