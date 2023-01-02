import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProfilesComponent } from './login-profiles.component';

describe('LoginProfilesComponent', () => {
  let component: LoginProfilesComponent;
  let fixture: ComponentFixture<LoginProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
