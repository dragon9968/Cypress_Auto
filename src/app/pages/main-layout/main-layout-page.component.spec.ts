import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { MainLayoutPageComponent } from './main-layout-page.component';
import { MainLayoutPageModule } from './main-layout-page.module';

describe('MainLayoutPageComponent', () => {
  let component: MainLayoutPageComponent;
  let fixture: ComponentFixture<MainLayoutPageComponent>;
  let actions$: Observable<Action>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MainLayoutPageComponent],
        imports: [
          RouterTestingModule,
          NoopAnimationsModule,
          MainLayoutPageModule,
        ],
        providers: [provideMockStore(), provideMockActions(() => actions$)],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
