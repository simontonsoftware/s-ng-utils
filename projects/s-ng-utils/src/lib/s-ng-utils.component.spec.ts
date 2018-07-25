import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SNgUtilsComponent } from './s-ng-utils.component';

describe('SNgUtilsComponent', () => {
  let component: SNgUtilsComponent;
  let fixture: ComponentFixture<SNgUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SNgUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SNgUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
