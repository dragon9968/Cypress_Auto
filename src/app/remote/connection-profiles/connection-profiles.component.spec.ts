import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionProfilesComponent } from './connection-profiles.component';

describe('ConnectionProfilesComponent', () => {
  let component: ConnectionProfilesComponent;
  let fixture: ComponentFixture<ConnectionProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
