import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformTestComponent } from './perform-test.component';

describe('PerformTestComponent', () => {
  let component: PerformTestComponent;
  let fixture: ComponentFixture<PerformTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
