import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowConnectionProfilesComponent } from './show-connection-profiles.component';

describe('ShowConnectionProfilesComponent', () => {
  let component: ShowConnectionProfilesComponent;
  let fixture: ComponentFixture<ShowConnectionProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowConnectionProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowConnectionProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
