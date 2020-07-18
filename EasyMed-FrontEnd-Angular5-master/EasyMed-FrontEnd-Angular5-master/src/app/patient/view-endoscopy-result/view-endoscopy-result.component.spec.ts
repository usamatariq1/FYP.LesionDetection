import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndoscopyResultComponent } from './view-endoscopy-result.component';

describe('ViewEndoscopyResultComponent', () => {
  let component: ViewEndoscopyResultComponent;
  let fixture: ComponentFixture<ViewEndoscopyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEndoscopyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEndoscopyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
