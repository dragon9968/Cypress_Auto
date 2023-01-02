import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConnectionProfilesComponent } from './add-edit-connection-profiles.component';

describe('AddEditConnectionProfilesComponent', () => {
  let component: AddEditConnectionProfilesComponent;
  let fixture: ComponentFixture<AddEditConnectionProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConnectionProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditConnectionProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
