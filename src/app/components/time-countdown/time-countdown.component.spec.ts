import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCountdownComponent } from './time-countdown.component';

describe('TimeCountdownComponent', () => {
  let component: TimeCountdownComponent;
  let fixture: ComponentFixture<TimeCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeCountdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
