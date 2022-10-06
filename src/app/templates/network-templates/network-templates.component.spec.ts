import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTemplatesComponent } from './network-templates.component';

describe('NetworkTemplatesComponent', () => {
  let component: NetworkTemplatesComponent;
  let fixture: ComponentFixture<NetworkTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
